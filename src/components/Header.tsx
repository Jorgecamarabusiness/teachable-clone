import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold tracking-tight">Ivan Orgánico</span>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
          <Link href="/cursos" className="hover:underline">
            Cursos
          </Link>
          <Link href="/admin/usuarios" className="hover:underline">
            Usuarios
          </Link>
          <Link href="/admin/estadisticas" className="hover:underline">
            Estadísticas
          </Link>
        </nav>

        <Link
          href="/login"
          className="rounded-full border border-black px-5 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
