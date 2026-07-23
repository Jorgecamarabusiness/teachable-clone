import type { VideoBlock as VideoBlockType } from "@/types";
import { Card } from "@/components/ui/Card";
import { toEmbedUrl } from "@/lib/embedUrl";

export function VideoBlock({ block }: { block: VideoBlockType }) {
  return (
    <Card className="aspect-video w-full overflow-hidden">
      <iframe
        src={toEmbedUrl(block.video_url)}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={block.title ?? "Contenido embebido"}
      />
    </Card>
  );
}
