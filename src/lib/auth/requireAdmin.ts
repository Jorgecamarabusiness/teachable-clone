import { createClient } from "@/lib/supabase/server";

type AdminCheck = { error: string | null };

export async function requireAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<AdminCheck> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para hacer esto." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return { error: "No tienes permisos de administrador." };
  }

  return { error: null };
}
