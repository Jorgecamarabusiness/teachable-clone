import type { TextBlock as TextBlockType } from "@/types";
import { Card } from "@/components/ui/Card";

export function TextBlock({ block }: { block: TextBlockType }) {
  return (
    <Card className="p-6">
      {block.title ? (
        <h3 className="text-sm font-semibold">{block.title}</h3>
      ) : null}
      <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-black/80">
        {block.content.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Card>
  );
}
