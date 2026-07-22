"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import type { ContentBlock } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
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

type PanelStep = "closed" | "choose" | "video" | "text";

const BLOCK_LABELS: Record<ContentBlock["type"], string> = {
  video: "Vídeo",
  text: "Texto",
};

const CONTENT_TYPES: Array<{
  key: "video" | "text" | "pdf" | "audio" | "image" | "quiz";
  label: string;
  icon: string;
  enabled: boolean;
}> = [
  { key: "video", label: "Vídeo", icon: "▶", enabled: true },
  { key: "text", label: "Texto", icon: "¶", enabled: true },
  { key: "pdf", label: "PDF", icon: "▤", enabled: false },
  { key: "audio", label: "Audio", icon: "♪", enabled: false },
  { key: "image", label: "Imagen/Banner", icon: "▥", enabled: false },
  { key: "quiz", label: "Quiz", icon: "?", enabled: false },
];

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
  const [step, setStep] = useState<PanelStep>("closed");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [lessonTitle, setLessonTitle] = useState(lesson.title);
  const [titleDraft, setTitleDraft] = useState(lesson.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function closePanel() {
    setStep("closed");
    setVideoTitle("");
    setVideoUrl("");
    setTextTitle("");
    setTextContent("");
    setActionError(null);
  }

  async function persist(newBlocks: ContentBlock[]): Promise<boolean> {
    setIsSaving(true);
    setActionError(null);

    const result = await updateLessonBlocksAction(lesson.id, newBlocks);

    setIsSaving(false);

    if (result.error) {
      setActionError(result.error);
      return false;
    }

    setBlocks(newBlocks);
    router.refresh();
    return true;
  }

  async function handleAddVideo(event: FormEvent) {
    event.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: "video",
      title: videoTitle.trim(),
      video_url: videoUrl.trim(),
    };

    const ok = await persist([...blocks, newBlock]);
    if (ok) closePanel();
  }

  async function handleAddText(event: FormEvent) {
    event.preventDefault();
    if (!textTitle.trim() || !textContent.trim()) return;

    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: "text",
      title: textTitle.trim(),
      content: textContent.trim(),
    };

    const ok = await persist([...blocks, newBlock]);
    if (ok) closePanel();
  }

  async function handleDeleteBlock(blockId: string) {
    await persist(blocks.filter((block) => block.id !== blockId));
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
      <p className="text-sm text-black/70">
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
              className="w-full border-b-2 border-black bg-transparent text-2xl font-bold tracking-tight outline-none"
            />
          ) : (
            <h1
              onClick={() => setIsEditingTitle(true)}
              className="cursor-text rounded px-1 -mx-1 text-2xl font-bold tracking-tight transition-colors hover:bg-black/5"
            >
              {lessonTitle}
            </h1>
          )}
          {titleError ? (
            <p className="mt-1 text-xs font-medium text-black/70">
              Error: {titleError}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={`/cursos/${course.id}/aprender?lesson=${lesson.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-black px-5 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white"
          >
            Preview
          </a>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Más opciones"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black text-lg leading-none transition-colors hover:bg-black hover:text-white"
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
                <div className="absolute right-0 z-20 mt-2 w-48 border border-black bg-white">
                  <button
                    type="button"
                    onClick={handleDeleteLesson}
                    disabled={isDeleting}
                    className="block w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-black hover:text-white disabled:opacity-50"
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
        <p className="mt-2 text-xs font-medium text-black/70">
          Error: {deleteError}
        </p>
      ) : null}

      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <h2 className="font-semibold">Contenido de la lección</h2>
          <Badge>{blocks.length} bloques</Badge>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {blocks.length === 0 ? (
            <p className="text-sm text-black/50">
              Todavía no hay contenido en esta lección.
            </p>
          ) : (
            blocks.map((block, index) => (
              <div
                key={block.id}
                className="flex items-center gap-3 border border-black/10 p-4"
              >
                <span className="text-xs font-medium text-black/40">
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
                  className="text-black/40 transition-colors hover:text-black disabled:opacity-40"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {actionError && step === "closed" ? (
          <p className="mt-4 text-xs font-medium text-black/70">
            Error: {actionError}
          </p>
        ) : null}

        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setStep("choose")}
        >
          + Añadir contenido
        </Button>
      </Card>

      {step !== "closed" && (
        <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col overflow-y-auto border-l border-black bg-white p-6 shadow-xl">
          {step === "choose" && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Añadir contenido</h3>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Cerrar"
                  className="text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {CONTENT_TYPES.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    disabled={!type.enabled}
                    onClick={() => {
                      if (type.key === "video" || type.key === "text") {
                        setStep(type.key);
                      }
                    }}
                    className={
                      type.enabled
                        ? "flex flex-col items-center gap-2 border border-black p-6 text-sm font-medium transition-colors hover:bg-black hover:text-white"
                        : "flex cursor-not-allowed flex-col items-center gap-1 border border-black/10 p-6 text-sm font-medium text-black/30"
                    }
                  >
                    <span className="text-xl">{type.icon}</span>
                    {type.label}
                    {!type.enabled ? (
                      <span className="text-[10px] font-normal uppercase tracking-wide">
                        Próximamente
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "video" && (
            <form onSubmit={handleAddVideo}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Añadir vídeo</h3>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Cerrar"
                  className="text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              <label className="mt-6 block text-xs font-medium text-black/70">
                Título
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(event) => setVideoTitle(event.target.value)}
                  className="mt-1 w-full border border-black px-3 py-2 text-sm text-black"
                  placeholder="Ej. Bienvenida al curso"
                />
              </label>

              <label className="mt-4 block text-xs font-medium text-black/70">
                URL del vídeo
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                  className="mt-1 w-full border border-black px-3 py-2 text-sm text-black"
                  placeholder="https://..."
                />
              </label>

              {actionError ? (
                <p className="mt-4 text-xs font-medium text-black/70">
                  Error: {actionError}
                </p>
              ) : null}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closePanel}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!videoTitle.trim() || !videoUrl.trim() || isSaving}
                >
                  {isSaving ? "Guardando..." : "Añadir"}
                </Button>
              </div>
            </form>
          )}

          {step === "text" && (
            <form onSubmit={handleAddText}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Añadir texto</h3>
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Cerrar"
                  className="text-lg leading-none"
                >
                  ✕
                </button>
              </div>

              <label className="mt-6 block text-xs font-medium text-black/70">
                Título
                <input
                  type="text"
                  value={textTitle}
                  onChange={(event) => setTextTitle(event.target.value)}
                  className="mt-1 w-full border border-black px-3 py-2 text-sm text-black"
                  placeholder="Ej. Resumen de la lección"
                />
              </label>

              <label className="mt-4 block text-xs font-medium text-black/70">
                Contenido
                <textarea
                  value={textContent}
                  onChange={(event) => setTextContent(event.target.value)}
                  rows={4}
                  className="mt-1 w-full border border-black px-3 py-2 text-sm text-black"
                  placeholder="Escribe el contenido de este bloque..."
                />
              </label>

              {actionError ? (
                <p className="mt-4 text-xs font-medium text-black/70">
                  Error: {actionError}
                </p>
              ) : null}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closePanel}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    !textTitle.trim() || !textContent.trim() || isSaving
                  }
                >
                  {isSaving ? "Guardando..." : "Añadir"}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
