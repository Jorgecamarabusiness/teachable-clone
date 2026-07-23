import type { ContentBlock } from "@/types";

export const BLOCK_LABELS: Record<ContentBlock["type"], string> = {
  video: "Embed media",
  video_file: "Vídeo",
  text: "Texto",
};

export const BLOCK_DEFAULT_TITLES: Record<ContentBlock["type"], string> = {
  video: "Bloque de embed",
  video_file: "Bloque de vídeo",
  text: "Bloque de texto",
};

function EmbedIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 6L2.5 10L7 14M13 6L17.5 10L13 14"
      />
    </svg>
  );
}

function VideoFileIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <rect x="2.5" y="5" width="11" height="10" rx="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 8.5l4-2.25v7.5l-4-2.25" />
    </svg>
  );
}

function TextIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h12M4 10h12M4 15h7" />
    </svg>
  );
}

export function BlockTypeIcon({
  type,
  className,
}: {
  type: ContentBlock["type"];
  className?: string;
}) {
  if (type === "video") return <EmbedIcon className={className} />;
  if (type === "video_file") return <VideoFileIcon className={className} />;
  return <TextIcon className={className} />;
}
