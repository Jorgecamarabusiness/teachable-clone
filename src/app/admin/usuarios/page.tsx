import { createClient } from "@/lib/supabase/server";

export default async function UsuariosPage() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: purchases }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: true }),
    supabase.from("purchases").select("user_id, amount_paid"),
  ]);

  const totalSpentByUser = new Map<string, number>();
  for (const purchase of purchases ?? []) {
    totalSpentByUser.set(
      purchase.user_id,
      (totalSpentByUser.get(purchase.user_id) ?? 0) + purchase.amount_paid
    );
  }

  const usuarios = profiles ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Listado de usuarios registrados en la plataforma.
        </p>

        {usuarios.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Todavía no hay usuarios registrados.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Total gastado</th>
                  <th className="px-4 py-3 font-semibold">Fecha de alta</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, index) => (
                  <tr
                    key={usuario.id}
                    className={
                      index !== usuarios.length - 1
                        ? "border-b border-border"
                        : ""
                    }
                  >
                    <td className="px-4 py-3 font-medium">{usuario.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {usuario.email}
                    </td>
                    <td className="px-4 py-3">
                      {(totalSpentByUser.get(usuario.id) ?? 0).toLocaleString(
                        "es-ES"
                      )}{" "}
                      €
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(usuario.created_at).toLocaleDateString(
                        "es-ES"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
