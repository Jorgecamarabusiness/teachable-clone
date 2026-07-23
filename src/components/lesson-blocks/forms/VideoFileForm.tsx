"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { uploadLessonMedia } from "@/lib/storage/uploadLessonMedia";

export function VideoFileForm({
  initialTitle = "",
  initialUrl = "",
  onCancel,
  onSubmit,
  isSaving,
  error,
  submitLabel,
}: {
  initialTitle?: string;
  initialUrl?: string;
  onCancel: () => void;
  onSubmit: (title: string, url: string) => void;
  isSaving: boolean;
  error: string | null;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [videoUrl, setVideoUrl] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const result = await uploadLessonMedia(file, "videos");

    setIsUploading(false);

    if (!result.url) {
      setUploadError(result.error ?? "No se pudo subir el vídeo.");
      return;
    }

    setVideoUrl(result.url);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim() || !videoUrl) return;
        onSubmit(title.trim(), videoUrl);
      }}
    >
      <label className="block text-xs font-medium text-muted-foreground">
        Título
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm text-foreground"
          placeholder="Ej. Clase 1"
        />
      </label>

      <div className="mt-4">
        <span className="block text-xs font-medium text-muted-foreground">
          Archivo de vídeo
        </span>

        {videoUrl ? (
          <video
            controls
            src={videoUrl}
            className="mt-2 aspect-video w-full max-w-sm rounded-md bg-muted"
          />
        ) : null}

        <label className="mt-2 inline-block">
          <span className="inline-flex cursor-pointer items-center rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-background">
            {isUploading
              ? "Subiendo..."
              : videoUrl
                ? "Cambiar vídeo"
                : "Subir vídeo"}
          </span>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={isUploading}
            onChange={handleFileSelected}
          />
        </label>

        {uploadError ? (
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {uploadError}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          Error: {error}
        </p>
      ) : null}

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!title.trim() || !videoUrl || isSaving || isUploading}
        >
          {isSaving ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
