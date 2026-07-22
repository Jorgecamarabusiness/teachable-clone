"use client";

import { useState, type FormEvent } from "react";
import type { ContentBlock } from "@/types";
import { Button } from "@/components/ui/Button";
import { updateLessonBlocksAction } from "@/app/admin/cursos/[id]/lecciones/[lessonId]/actions";

type PanelStep = "choose" | "video" | "text";

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

export function AddContentPanel({
  lessonId,
  blocks,
  onClose,
  onBlocksSaved,
}: {
  lessonId: string;
  blocks: ContentBlock[];
  onClose: () => void;
  onBlocksSaved: (blocks: ContentBlock[]) => void;
}) {
  const [step, setStep] = useState<PanelStep>("choose");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function persist(newBlocks: ContentBlock[]): Promise<boolean> {
    setIsSaving(true);
    setActionError(null);

    const result = await updateLessonBlocksAction(lessonId, newBlocks);

    setIsSaving(false);

    if (result.error) {
      setActionError(result.error);
      return false;
    }

    onBlocksSaved(newBlocks);
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
    if (ok) onClose();
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
    if (ok) onClose();
  }

  return (
    <div className="mt-6 rounded-lg border border-border p-6">
      {step === "choose" && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Añadir contenido</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-lg leading-none text-muted-foreground transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                    ? "flex flex-col items-center gap-2 rounded-md border border-border p-6 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                    : "flex cursor-not-allowed flex-col items-center gap-1 rounded-md border border-border p-6 text-sm font-medium text-muted-foreground opacity-50"
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
        <form onSubmit={handleAddVideo} className="max-w-md">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Añadir vídeo</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-lg leading-none text-muted-foreground transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <label className="mt-6 block text-xs font-medium text-muted-foreground">
            Título
            <input
              type="text"
              value={videoTitle}
              onChange={(event) => setVideoTitle(event.target.value)}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-foreground"
              placeholder="Ej. Bienvenida al curso"
            />
          </label>

          <label className="mt-4 block text-xs font-medium text-muted-foreground">
            URL del vídeo
            <input
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-foreground"
              placeholder="https://..."
            />
          </label>

          {actionError ? (
            <p className="mt-4 text-xs font-medium text-muted-foreground">
              Error: {actionError}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
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
        <form onSubmit={handleAddText} className="max-w-md">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Añadir texto</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-lg leading-none text-muted-foreground transition-colors hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <label className="mt-6 block text-xs font-medium text-muted-foreground">
            Título
            <input
              type="text"
              value={textTitle}
              onChange={(event) => setTextTitle(event.target.value)}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-foreground"
              placeholder="Ej. Resumen de la lección"
            />
          </label>

          <label className="mt-4 block text-xs font-medium text-muted-foreground">
            Contenido
            <textarea
              value={textContent}
              onChange={(event) => setTextContent(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-foreground"
              placeholder="Escribe el contenido de este bloque..."
            />
          </label>

          {actionError ? (
            <p className="mt-4 text-xs font-medium text-muted-foreground">
              Error: {actionError}
            </p>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!textTitle.trim() || !textContent.trim() || isSaving}
            >
              {isSaving ? "Guardando..." : "Añadir"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
