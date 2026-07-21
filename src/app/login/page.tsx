import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-2xl font-bold tracking-tight">
            Inicia sesión en tu cuenta
          </h1>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-black/70">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="font-medium underline">
              Regístrate
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
