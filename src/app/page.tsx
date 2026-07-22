import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonClassName } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: featuredCourses } = await supabase
    .from("courses")
    .select("id, title, price")
    .order("created_at", { ascending: true })
    .limit(6);

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Aprende dropshipping orgánico junto a miles de usuarios con Iván
          </h1>
          <div className="mt-10">
            <Link href="/login" className={buttonClassName("primary", "lg")}>
              Empezar a ver
            </Link>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Cursos destacados
            </h2>

            {featuredCourses && featuredCourses.length > 0 ? (
              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {featuredCourses.map((course) => (
                  <article
                    key={course.id}
                    className="flex flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground"
                  >
                    <div className="flex aspect-video items-center justify-center border-b border-border bg-muted">
                      <span className="text-sm font-medium text-muted-foreground">
                        Imagen del curso
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <h3 className="text-lg font-semibold leading-snug">
                        {course.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
