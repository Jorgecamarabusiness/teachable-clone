import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { createLessonAction } from "./actions";

function NotFound({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />
      <div className="mx-auto flex flex-1 items-center px-6 py-24">
        <p className="text-sm text-black/70">{message}</p>
      </div>
      <Footer />
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
    .select("id, title")
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

  const sections = sectionsData ?? [];
  const lessons = lessonsData ?? [];

  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Link
          href="/admin/cursos"
          className="text-sm font-medium hover:underline"
        >
          ← Volver a cursos
        </Link>

        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {course.title}
        </h1>

        <div className="mt-8 flex flex-col gap-4">
          {sections.length === 0 ? (
            <p className="text-sm text-black/50">
              Este curso todavía no tiene secciones.
            </p>
          ) : (
            sections.map((section) => {
              const sectionLessons = lessons.filter(
                (lesson) => lesson.section_id === section.id
              );

              return (
                <details
                  key={section.id}
                  className="group border border-black"
                  open
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 font-semibold">
                    {section.title}
                    <span className="text-black/40 transition-transform group-open:rotate-180">
                      ▾
                    </span>
                  </summary>

                  <div className="border-t border-black/10">
                    {sectionLessons.length === 0 ? (
                      <p className="px-6 py-4 text-sm text-black/50">
                        Esta sección todavía no tiene lecciones.
                      </p>
                    ) : (
                      sectionLessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/admin/cursos/${course.id}/lecciones/${lesson.id}`}
                          className="block border-b border-black/10 px-6 py-3 text-sm font-medium transition-colors last:border-b-0 hover:bg-black/5"
                        >
                          {lesson.title}
                        </Link>
                      ))
                    )}

                    <form
                      action={createLessonAction.bind(
                        null,
                        section.id,
                        course.id
                      )}
                      className="border-t border-black/10 px-6 py-4"
                    >
                      <Button type="submit" variant="outline">
                        + Nueva lección
                      </Button>
                    </form>
                  </div>
                </details>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
