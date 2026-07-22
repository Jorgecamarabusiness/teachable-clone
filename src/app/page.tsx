import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonClassName } from "@/components/ui/Button";

export default function Home() {
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
      </main>

      <Footer />
    </div>
  );
}
