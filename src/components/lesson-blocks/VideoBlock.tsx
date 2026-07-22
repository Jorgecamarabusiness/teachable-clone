import type { VideoBlock as VideoBlockType } from "@/types";
import { Card } from "@/components/ui/Card";

export function VideoBlock({ block }: { block: VideoBlockType }) {
  return (
    <Card className="relative aspect-video w-full overflow-hidden">
      <video controls className="h-full w-full bg-muted">
        {block.video_url ? <source src={block.video_url} /> : null}
      </video>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium text-muted-foreground">
          Vista previa del vídeo no disponible
        </span>
      </div>
    </Card>
  );
}
