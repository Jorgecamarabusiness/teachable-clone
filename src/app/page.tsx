import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { courses } from "@/data/courses";

const featuredCourses = courses.slice(0, 3);

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white text-black">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Aprende dropshipping orgánico junto a miles de usuarios con Iván
          </h1>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-block rounded-full bg-black px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-black/80"
            >
              Empezar a ver
            </Link>
          </div>
        </section>

        <section className="border-t border-black">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Cursos destacados
            </h2>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <article
                  key={course.id}
                  className="flex flex-col border border-black"
                >
                  <div className="flex aspect-video items-center justify-center border-b border-black bg-black/5">
                    <span className="text-sm font-medium text-black/40">
                      Imagen del curso
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <h3 className="text-lg font-semibold leading-snug">
                      {course.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold">
                        {course.price}
                      </span>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
