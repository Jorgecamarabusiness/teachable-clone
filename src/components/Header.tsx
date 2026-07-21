import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/auth/actions";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let name: string | null = null;
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, is_admin")
      .eq("id", user.id)
      .single();

    name = profile?.name ?? null;
    isAdmin = profile?.is_admin ?? false;
  }

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
          {isAdmin && (
            <>
              <Link href="/admin/usuarios" className="hover:underline">
                Usuarios
              </Link>
              <Link href="/admin/estadisticas" className="hover:underline">
                Estadísticas
              </Link>
            </>
          )}
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium sm:inline">
              {name ?? user.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-black px-5 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="hover:underline">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-black px-5 py-2 transition-colors hover:bg-black hover:text-white"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
