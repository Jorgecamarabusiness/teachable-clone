import type { VideoFileBlock as VideoFileBlockType } from "@/types";
import { Card } from "@/components/ui/Card";

export function VideoFileBlock({ block }: { block: VideoFileBlockType }) {
  return (
    <Card className="aspect-video w-full overflow-hidden">
      <video controls className="h-full w-full bg-muted" src={block.video_url} />
    </Card>
  );
}
