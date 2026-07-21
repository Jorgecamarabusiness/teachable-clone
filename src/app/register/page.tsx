import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-2xl font-bold tracking-tight">
            Crea tu cuenta
          </h1>

          <RegisterForm />

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
