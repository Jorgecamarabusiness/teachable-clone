"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import type { ContentBlock } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { AddContentPanel } from "@/components/lesson-blocks/AddContentPanel";
import {
  deleteLessonAction,
  updateLessonBlocksAction,
  updateLessonTitleAction,
} from "./actions";

type CourseSummary = {
  id: string;
  title: string;
};

type SectionSummary = {
  id: string;
  title: string;
};

type LessonSummary = {
  id: string;
  title: string;
  blocks: ContentBlock[];
};

const BLOCK_LABELS: Record<ContentBlock["type"], string> = {
  video: "Vídeo",
  text: "Texto",
};

export function LessonEditorView({
  course,
  section,
  lesson,
}: {
  course: CourseSummary;
  section: SectionSummary;
  lesson: LessonSummary;
}) {
  const router = useRouter();

  const [blocks, setBlocks] = useState<ContentBlock[]>(lesson.blocks);
  const [isAddPanelOpen, setAddPanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [lessonTitle, setLessonTitle] = useState(lesson.title);
  const [titleDraft, setTitleDraft] = useState(lesson.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleBlocksSaved(newBlocks: ContentBlock[]) {
    setBlocks(newBlocks);
    router.refresh();
  }

  async function handleDeleteBlock(blockId: string) {
    setIsSaving(true);
    setActionError(null);

    const newBlocks = blocks.filter((block) => block.id !== blockId);
    const result = await updateLessonBlocksAction(lesson.id, newBlocks);

    setIsSaving(false);

    if (result.error) {
      setActionError(result.error);
      return;
    }

    setBlocks(newBlocks);
    router.refresh();
  }

  async function saveTitle() {
    const trimmed = titleDraft.trim();

    if (!trimmed || trimmed === lessonTitle) {
      setTitleDraft(lessonTitle);
      setIsEditingTitle(false);
      return;
    }

    setTitleError(null);
    const result = await updateLessonTitleAction(lesson.id, trimmed);

    if (result.error) {
      setTitleError(result.error);
      setTitleDraft(lessonTitle);
      setIsEditingTitle(false);
      return;
    }

    setLessonTitle(trimmed);
    setIsEditingTitle(false);
    router.refresh();
  }

  function handleTitleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      setTitleDraft(lessonTitle);
      setIsEditingTitle(false);
    }
  }

  async function handleDeleteLesson() {
    setMenuOpen(false);

    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta lección? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteLessonAction(lesson.id, course.id);

    setIsDeleting(false);
    if (result?.error) {
      setDeleteError(result.error);
    }
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">
        <Link
          href={`/admin/cursos/${course.id}`}
          className="hover:underline"
        >
          {course.title}
        </Link>{" "}
        / {section.title}
      </p>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div className="flex-1">
          {isEditingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={saveTitle}
              onKeyDown={handleTitleKeyDown}
              className="w-full border-b-2 border-foreground bg-transparent text-2xl font-bold tracking-tight outline-none"
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className="-mx-1 cursor-text rounded px-1 text-2xl font-bold tracking-tight transition-colors hover:bg-muted"
            >
              {lessonTitle}
            </h1>
          )}
          {titleError ? (
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              Error: {titleError}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={`/cursos/${course.id}/aprender?lesson=${lesson.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            Preview
          </a>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Más opciones"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-lg leading-none transition-colors hover:bg-foreground hover:text-background"
            >
              ⋮
            </button>

            {isMenuOpen && (
              <>
                <button
                  type="button"
                  aria-hidden="true"
                  tabIndex={-1}
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-border bg-background">
                  <button
                    type="button"
                    onClick={handleDeleteLesson}
                    disabled={isDeleting}
                    className="block w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar lección"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {deleteError ? (
        <p className="mt-2 text-xs font-medium text-muted-foreground">
          Error: {deleteError}
        </p>
      ) : null}

      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="font-semibold">Contenido de la lección</h2>
          <Badge>{blocks.length} bloques</Badge>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todavía no hay contenido en esta lección.
            </p>
          ) : (
            blocks.map((block, index) => (
              <div
                key={block.id}
                className="flex items-center gap-3 rounded-md border border-border p-4"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <Badge variant="outline">{BLOCK_LABELS[block.type]}</Badge>
                <span className="flex-1 text-sm font-medium">
                  {block.title ??
                    (block.type === "video"
                      ? "Bloque de vídeo"
                      : "Bloque de texto")}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteBlock(block.id)}
                  disabled={isSaving}
                  aria-label="Eliminar bloque"
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {actionError ? (
          <p className="mt-4 text-xs font-medium text-muted-foreground">
            Error: {actionError}
          </p>
        ) : null}

        {!isAddPanelOpen && (
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setAddPanelOpen(true)}
          >
            + Añadir contenido
          </Button>
        )}
      </Card>

      {isAddPanelOpen && (
        <AddContentPanel
          lessonId={lesson.id}
          blocks={blocks}
          onClose={() => setAddPanelOpen(false)}
          onBlocksSaved={handleBlocksSaved}
        />
      )}
    </>
  );
}
