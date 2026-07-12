"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-2xl font-bold tracking-tight">
            Crea tu cuenta
          </h1>

          <form
            className="mt-10 flex flex-col gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              // TODO: conectar con Supabase Auth
            }}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                className="rounded-md border border-black px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                className="rounded-md border border-black px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="rounded-md border border-black px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="rounded-md border border-black px-4 py-3 text-sm outline-none placeholder:text-black/40 focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/80"
            >
              Crear cuenta
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-black/70">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-medium underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
