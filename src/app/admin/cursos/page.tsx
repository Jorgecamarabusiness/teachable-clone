import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const [{ data: courses }, { data: sections }, { data: lessons }] =
    await Promise.all([
      supabase
        .from("courses")
        .select("id, title, price")
        .order("created_at", { ascending: true }),
      supabase.from("sections").select("id, course_id"),
      supabase.from("lessons").select("id, course_id"),
    ]);

  const sectionCounts = new Map<string, number>();
  for (const section of sections ?? []) {
    sectionCounts.set(
      section.course_id,
      (sectionCounts.get(section.course_id) ?? 0) + 1
    );
  }

  const lessonCounts = new Map<string, number>();
  for (const lesson of lessons ?? []) {
    lessonCounts.set(
      lesson.course_id,
      (lessonCounts.get(lesson.course_id) ?? 0) + 1
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Cursos</h1>
        <p className="mt-2 text-sm text-black/70">
          Gestiona el currículum de cada curso.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {!courses || courses.length === 0 ? (
            <p className="text-sm text-black/50">Todavía no hay cursos.</p>
          ) : (
            courses.map((course) => (
              <Card
                key={course.id}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold leading-snug">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-black/70">
                    ${course.price} · {sectionCounts.get(course.id) ?? 0}{" "}
                    secciones · {lessonCounts.get(course.id) ?? 0} lecciones
                  </p>
                </div>
                <Link
                  href={`/admin/cursos/${course.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-black px-6 py-3 text-sm font-semibold transition-colors hover:bg-black hover:text-white"
                >
                  Editar currículum
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
