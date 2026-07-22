import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/auth/actions";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let name: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    name = profile?.name ?? null;
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-xl font-bold tracking-tight">Ivan Orgánico</span>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium sm:inline">
              {name ?? user.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}
