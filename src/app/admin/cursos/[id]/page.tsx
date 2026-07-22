import { createClient } from "@/lib/supabase/server";
import { CurriculumEditor } from "./CurriculumEditor";

function NotFound({ message }: { message: string }) {
  return (
    <div className="flex items-center px-6 py-24">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default async function CourseCurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, status")
    .eq("id", id)
    .maybeSingle();

  if (!course) {
    return <NotFound message="Curso no encontrado." />;
  }

  const [{ data: sectionsData }, { data: lessonsData }] = await Promise.all([
    supabase
      .from("sections")
      .select("id, title, order_index")
      .eq("course_id", id)
      .order("order_index", { ascending: true }),
    supabase
      .from("lessons")
      .select("id, section_id, title, order_index")
      .eq("course_id", id)
      .order("order_index", { ascending: true }),
  ]);

  const lessons = lessonsData ?? [];
  const sections = (sectionsData ?? []).map((section) => ({
    id: section.id,
    title: section.title,
    lessons: lessons
      .filter((lesson) => lesson.section_id === section.id)
      .map((lesson) => ({ id: lesson.id, title: lesson.title })),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <CurriculumEditor
        course={{
          id: course.id,
          title: course.title,
          status: course.status === "draft" ? "draft" : "published",
        }}
        sections={sections}
      />
    </div>
  );
}
