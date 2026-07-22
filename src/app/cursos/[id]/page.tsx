import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BuyCourseButton } from "./BuyCourseButton";
import { createClient } from "@/lib/supabase/server";

function NotFound() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <Header />
      <div className="mx-auto flex flex-1 flex-col items-center gap-4 px-6 py-24 text-center">
        <p className="text-sm text-muted-foreground">Curso no encontrado.</p>
        <Link href="/cursos" className="text-sm font-medium hover:underline">
          ← Volver a cursos
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default async function CursoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, price, long_description, learning_points, status")
    .eq("id", id)
    .maybeSingle();

  if (!course) {
    return <NotFound />;
  }

  if (course.status !== "published") {
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

    if (!isAdmin) {
      return <NotFound />;
    }
  }

  const longDescription = (course.long_description ?? "")
    .split("\n\n")
    .map((paragraph: string) => paragraph.trim())
    .filter((paragraph: string) => paragraph.length > 0);
  const learningPoints = course.learning_points ?? [];

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <Link href="/cursos" className="text-sm font-medium hover:underline">
            ← Volver a cursos
          </Link>

          <div className="mt-6 flex aspect-video w-full items-center justify-center rounded-lg border border-border bg-muted">
            <span className="text-sm font-medium text-muted-foreground">
              Imagen del curso
            </span>
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
            {course.title}
          </h1>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              {longDescription.map((paragraph: string, index: number) => (
                <p key={index} className="leading-relaxed text-foreground/80">
                  {paragraph}
                </p>
              ))}

              {learningPoints.length > 0 ? (
                <div>
                  <h2 className="text-lg font-semibold">Lo que aprenderás</h2>
                  <ul className="mt-4 flex flex-col gap-3">
                    {learningPoints.map((point: string) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="mt-0.5 font-bold">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="h-fit rounded-lg border border-border p-6 lg:sticky lg:top-8">
              <p className="text-sm text-muted-foreground">Precio</p>
              <p className="mt-1 text-4xl font-bold">${course.price}</p>

              <BuyCourseButton />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
