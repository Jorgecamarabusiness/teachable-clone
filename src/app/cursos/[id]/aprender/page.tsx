import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AprenderView } from "./AprenderView";
import type { ContentBlock, Lesson, Section } from "@/types";

function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />
      <div className="mx-auto flex flex-1 items-center px-6 py-24">
        <p className="text-sm text-black/70">Curso no encontrado.</p>
      </div>
      <Footer />
    </div>
  );
}

export default async function AprenderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { id } = await params;
  const { lesson: initialLessonId } = await searchParams;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", id)
    .maybeSingle();

  if (!course) {
    return <NotFound />;
  }

  const [{ data: sectionsData }, { data: lessonsData }] = await Promise.all([
    supabase
      .from("sections")
      .select("id, course_id, title, order_index")
      .eq("course_id", id)
      .order("order_index", { ascending: true }),
    supabase
      .from("lessons")
      .select("id, section_id, course_id, title, order_index, blocks")
      .eq("course_id", id)
      .order("order_index", { ascending: true }),
  ]);

  const sections: Section[] = (sectionsData ?? []).map((section) => ({
    id: section.id,
    courseId: section.course_id,
    title: section.title,
    order: section.order_index,
    lessons: (lessonsData ?? [])
      .filter((lesson) => lesson.section_id === section.id)
      .map(
        (lesson): Lesson => ({
          id: lesson.id,
          sectionId: lesson.section_id,
          courseId: lesson.course_id,
          title: lesson.title,
          order: lesson.order_index,
          duration: 0,
          isPreview: false,
          blocks: (lesson.blocks ?? []) as ContentBlock[],
        })
      ),
  }));

  return (
    <AprenderView
      course={{ id: course.id, title: course.title, sections }}
      initialLessonId={initialLessonId}
    />
  );
}
