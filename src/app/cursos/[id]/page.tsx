import Link from "next/link";
import { notFound } from "next/navigation";
import { mockCourses as courses, getCourseById } from "@/lib/mock-data";
import { BuyCourseButton } from "./BuyCourseButton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }));
}

export default async function CursoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <Link href="/cursos" className="text-sm font-medium hover:underline">
            ← Volver a cursos
          </Link>

          <div className="mt-6 flex aspect-video w-full items-center justify-center border border-black bg-black/5">
            <span className="text-sm font-medium text-black/40">
              Imagen del curso
            </span>
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
            {course.title}
          </h1>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              {course.longDescription.map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-black/80">
                  {paragraph}
                </p>
              ))}

              <div>
                <h2 className="text-lg font-semibold">Lo que aprenderás</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {course.learnPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 font-bold">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="h-fit border border-black p-6 lg:sticky lg:top-8">
              <p className="text-sm text-black/70">Precio</p>
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
