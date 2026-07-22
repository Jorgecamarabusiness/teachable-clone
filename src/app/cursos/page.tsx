import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonClassName } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export default async function CursosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.is_admin ?? false;
  }

  let coursesQuery = supabase
    .from("courses")
    .select("id, title, description, price")
    .order("created_at", { ascending: true });

  if (!isAdmin) {
    coursesQuery = coursesQuery.eq("status", "published");
  }

  const { data: courses } = await coursesQuery;

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Todos los cursos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Explora nuestro catálogo completo y encuentra el curso que
            necesitas.
          </p>

          {courses && courses.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className="flex flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground"
                >
                  <div className="flex aspect-video items-center justify-center border-b border-border bg-muted">
                    <span className="text-sm font-medium text-muted-foreground">
                      Imagen del curso
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h2 className="text-lg font-semibold leading-snug">
                      {course.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-xl font-bold">
                        ${course.price}
                      </span>
                      <Link
                        href={`/cursos/${course.id}`}
                        className={buttonClassName("outline", "sm")}
                      >
                        Ver curso
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              Todavía no hay cursos publicados.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
