import { createClient } from "@/lib/supabase/server";
import { LessonEditorView } from "./LessonEditorView";
import type { ContentBlock } from "@/types";

function NotFound({ message }: { message: string }) {
  return (
    <div className="flex items-center px-6 py-24">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default async function LessonEditorPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", id)
    .maybeSingle();

  if (!course) {
    return <NotFound message="Curso no encontrado." />;
  }

  const { data: lessonRow } = await supabase
    .from("lessons")
    .select("id, title, blocks, section_id")
    .eq("id", lessonId)
    .eq("course_id", id)
    .maybeSingle();

  if (!lessonRow) {
    return <NotFound message="Lección no encontrada." />;
  }

  const { data: section } = await supabase
    .from("sections")
    .select("id, title")
    .eq("id", lessonRow.section_id)
    .eq("course_id", id)
    .maybeSingle();

  if (!section) {
    return <NotFound message="Sección no encontrada." />;
  }

  const lesson = {
    id: lessonRow.id,
    title: lessonRow.title,
    blocks: (lessonRow.blocks ?? []) as ContentBlock[],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <LessonEditorView course={course} section={section} lesson={lesson} />
    </div>
  );
}
