"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/Button";
import { updateLessonTitleAction } from "./lecciones/[lessonId]/actions";
import {
  createLessonAction,
  createSectionAction,
  reorderLessonsAction,
  reorderSectionsAction,
  updateCourseStatusAction,
  updateCourseTitleAction,
  updateSectionTitleAction,
} from "./actions";

type CourseStatus = "published" | "draft";

type LessonSummary = {
  id: string;
  title: string;
};

type SectionSummary = {
  id: string;
  title: string;
  lessons: LessonSummary[];
};

type CourseSummary = {
  id: string;
  title: string;
  status: CourseStatus;
};

function LessonRow({
  lesson,
  courseId,
  sectionId,
  onTitleSaved,
}: {
  lesson: LessonSummary;
  courseId: string;
  sectionId: string;
  onTitleSaved: (sectionId: string, lessonId: string, title: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [titleDraft, setTitleDraft] = useState(lesson.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  async function saveTitle() {
    const trimmed = titleDraft.trim();
    if (!trimmed || trimmed === lesson.title) {
      setTitleDraft(lesson.title);
      setIsEditingTitle(false);
      return;
    }

    setTitleError(null);
    const result = await updateLessonTitleAction(lesson.id, trimmed);

    if (result.error) {
      setTitleError(result.error);
      setTitleDraft(lesson.title);
      setIsEditingTitle(false);
      return;
    }

    onTitleSaved(sectionId, lesson.id, trimmed);
    setIsEditingTitle(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      setTitleDraft(lesson.title);
      setIsEditingTitle(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reordenar lección"
        className="cursor-grab touch-none px-1 text-muted-foreground active:cursor-grabbing"
      >
        ⠿
      </button>

      <div className="min-w-0 flex-1">
        {isEditingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleKeyDown}
            className="w-full border-b border-foreground bg-transparent text-sm font-medium outline-none"
          />
        ) : (
          <span
            onClick={() => setIsEditingTitle(true)}
            className="-mx-1 cursor-text truncate rounded px-1 text-sm font-medium transition-colors hover:bg-muted"
          >
            {lesson.title}
          </span>
        )}
        {titleError ? (
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Error: {titleError}
          </p>
        ) : null}
      </div>

      <Link
        href={`/admin/cursos/${courseId}/lecciones/${lesson.id}`}
        className="shrink-0 text-xs font-medium text-muted-foreground hover:underline"
      >
        Editar contenido →
      </Link>
    </div>
  );
}

function SectionRow({
  section,
  courseId,
  onTitleSaved,
  onLessonTitleSaved,
  onLessonDragEnd,
}: {
  section: SectionSummary;
  courseId: string;
  onTitleSaved: (sectionId: string, title: string) => void;
  onLessonTitleSaved: (sectionId: string, lessonId: string, title: string) => void;
  onLessonDragEnd: (sectionId: string, event: DragEndEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isOpen, setIsOpen] = useState(true);
  const [titleDraft, setTitleDraft] = useState(section.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  const lessonSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function saveTitle() {
    const trimmed = titleDraft.trim();
    if (!trimmed || trimmed === section.title) {
      setTitleDraft(section.title);
      setIsEditingTitle(false);
      return;
    }

    setTitleError(null);
    const result = await updateSectionTitleAction(section.id, trimmed);

    if (result.error) {
      setTitleError(result.error);
      setTitleDraft(section.title);
      setIsEditingTitle(false);
      return;
    }

    onTitleSaved(section.id, trimmed);
    setIsEditingTitle(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      setTitleDraft(section.title);
      setIsEditingTitle(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="overflow-hidden rounded-lg border border-border bg-background"
    >
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Reordenar sección"
          className="cursor-grab touch-none px-1 text-muted-foreground active:cursor-grabbing"
        >
          ⠿
        </button>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-label={isOpen ? "Contraer sección" : "Expandir sección"}
          className="text-muted-foreground transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : undefined }}
        >
          ▾
        </button>

        <div className="min-w-0 flex-1">
          {isEditingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={saveTitle}
              onKeyDown={handleKeyDown}
              className="w-full border-b border-foreground bg-transparent font-semibold outline-none"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="-mx-1 cursor-text truncate rounded px-1 font-semibold transition-colors hover:bg-muted"
            >
              {section.title}
            </span>
          )}
          {titleError ? (
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Error: {titleError}
            </p>
          ) : null}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border">
          {section.lessons.length === 0 ? (
            <p className="px-6 py-4 text-sm text-muted-foreground">
              Esta sección todavía no tiene lecciones.
            </p>
          ) : (
            <DndContext
              sensors={lessonSensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => onLessonDragEnd(section.id, event)}
            >
              <SortableContext
                items={section.lessons.map((lesson) => lesson.id)}
                strategy={verticalListSortingStrategy}
              >
                {section.lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    courseId={courseId}
                    sectionId={section.id}
                    onTitleSaved={onLessonTitleSaved}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          <form
            action={createLessonAction.bind(null, section.id, courseId)}
            className="border-t border-border px-6 py-4"
          >
            <Button type="submit" variant="outline">
              + Nueva lección
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export function CurriculumEditor({
  course,
  sections: initialSections,
}: {
  course: CourseSummary;
  sections: SectionSummary[];
}) {
  const router = useRouter();

  const [courseTitle, setCourseTitle] = useState(course.title);
  const [courseTitleDraft, setCourseTitleDraft] = useState(course.title);
  const [isEditingCourseTitle, setIsEditingCourseTitle] = useState(false);
  const [courseTitleError, setCourseTitleError] = useState<string | null>(null);

  const [status, setStatus] = useState<CourseStatus>(course.status);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [sections, setSections] = useState(initialSections);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [addSectionError, setAddSectionError] = useState<string | null>(null);

  const sectionSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function saveCourseTitle() {
    const trimmed = courseTitleDraft.trim();
    if (!trimmed || trimmed === courseTitle) {
      setCourseTitleDraft(courseTitle);
      setIsEditingCourseTitle(false);
      return;
    }

    setCourseTitleError(null);
    const result = await updateCourseTitleAction(course.id, trimmed);

    if (result.error) {
      setCourseTitleError(result.error);
      setCourseTitleDraft(courseTitle);
      setIsEditingCourseTitle(false);
      return;
    }

    setCourseTitle(trimmed);
    setIsEditingCourseTitle(false);
  }

  function handleCourseTitleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      setCourseTitleDraft(courseTitle);
      setIsEditingCourseTitle(false);
    }
  }

  async function toggleStatus() {
    const nextStatus: CourseStatus = status === "published" ? "draft" : "published";
    setIsTogglingStatus(true);
    setStatusError(null);

    const result = await updateCourseStatusAction(course.id, nextStatus);
    setIsTogglingStatus(false);

    if (result.error) {
      setStatusError(result.error);
      return;
    }

    setStatus(nextStatus);
    router.refresh();
  }

  async function handleAddSection() {
    setIsAddingSection(true);
    setAddSectionError(null);

    const result = await createSectionAction(course.id);
    setIsAddingSection(false);

    if (!result.ok) {
      setAddSectionError(result.error);
      return;
    }

    setSections((prev) => [...prev, { ...result.section, lessons: [] }]);
  }

  function handleSectionTitleSaved(sectionId: string, title: string) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      )
    );
  }

  function handleLessonTitleSaved(
    sectionId: string,
    lessonId: string,
    title: string
  ) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, title } : lesson
              ),
            }
          : section
      )
    );
  }

  async function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sections, oldIndex, newIndex);
    setSections(reordered);

    await reorderSectionsAction(
      course.id,
      reordered.map((section) => section.id)
    );
  }

  async function handleLessonDragEnd(sectionId: string, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const section = sections.find((item) => item.id === sectionId);
    if (!section) return;

    const oldIndex = section.lessons.findIndex((lesson) => lesson.id === active.id);
    const newIndex = section.lessons.findIndex((lesson) => lesson.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedLessons = arrayMove(section.lessons, oldIndex, newIndex);

    setSections((prev) =>
      prev.map((item) =>
        item.id === sectionId ? { ...item, lessons: reorderedLessons } : item
      )
    );

    await reorderLessonsAction(
      sectionId,
      reorderedLessons.map((lesson) => lesson.id)
    );
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {isEditingCourseTitle ? (
            <input
              autoFocus
              value={courseTitleDraft}
              onChange={(event) => setCourseTitleDraft(event.target.value)}
              onBlur={saveCourseTitle}
              onKeyDown={handleCourseTitleKeyDown}
              className="w-full border-b-2 border-foreground bg-transparent text-2xl font-bold tracking-tight outline-none"
            />
          ) : (
            <h1
              onClick={() => setIsEditingCourseTitle(true)}
              className="-mx-1 cursor-text truncate rounded px-1 text-2xl font-bold tracking-tight transition-colors hover:bg-muted"
            >
              {courseTitle}
            </h1>
          )}
          {courseTitleError ? (
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Error: {courseTitleError}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggleStatus}
          disabled={isTogglingStatus}
          className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
            status === "published"
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "border border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          {status === "published" ? "Publicado" : "Borrador"}
        </button>
      </div>
      {statusError ? (
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          Error: {statusError}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4">
        {sections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Este curso todavía no tiene secciones.
          </p>
        ) : (
          <DndContext
            sensors={sectionSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SectionRow
                  key={section.id}
                  section={section}
                  courseId={course.id}
                  onTitleSaved={handleSectionTitleSaved}
                  onLessonTitleSaved={handleLessonTitleSaved}
                  onLessonDragEnd={handleLessonDragEnd}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSection}
            disabled={isAddingSection}
          >
            {isAddingSection ? "Creando..." : "+ Nueva sección"}
          </Button>
          {addSectionError ? (
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Error: {addSectionError}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}
