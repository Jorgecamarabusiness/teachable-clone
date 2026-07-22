import Link from "next/link";
import { mockCourses as courses } from "@/lib/mock-data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function CursosPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Todos los cursos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-black/70">
            Explora nuestro catálogo completo y encuentra el curso que
            necesitas.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="flex flex-col border border-black"
              >
                <div className="flex aspect-video items-center justify-center border-b border-black bg-black/5">
                  <span className="text-sm font-medium text-black/40">
                    Imagen del curso
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h2 className="text-lg font-semibold leading-snug">
                    {course.title}
                  </h2>
                  <p className="text-sm text-black/70">{course.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-xl font-bold">${course.price}</span>
                    <Link
                      href={`/cursos/${course.id}`}
                      className="rounded-full border border-black px-4 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white"
                    >
                      Ver curso
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
