import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-black/70 sm:flex-row sm:justify-between">
        <span>© 2026 Ivan Orgánico. Todos los derechos reservados.</span>
        <nav className="flex gap-6">
          <Link href="/cursos" className="hover:underline">
            Cursos
          </Link>
          <Link href="/login" className="hover:underline">
            Iniciar sesión
          </Link>
        </nav>
      </div>
    </footer>
  );
}
