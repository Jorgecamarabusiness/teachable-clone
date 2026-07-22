import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { userStats as usuarios } from "@/lib/mock-data";

export default function UsuariosPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="mt-2 text-sm text-black/70">
          Listado de usuarios registrados en la plataforma.
        </p>

        <div className="mt-8 overflow-x-auto border border-black">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-black">
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Total gastado</th>
                <th className="px-4 py-3 font-semibold">Fecha de alta</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr
                  key={usuario.email}
                  className={
                    index !== usuarios.length - 1
                      ? "border-b border-black/20"
                      : ""
                  }
                >
                  <td className="px-4 py-3 font-medium">{usuario.nombre}</td>
                  <td className="px-4 py-3 text-black/70">{usuario.email}</td>
                  <td className="px-4 py-3">
                    {usuario.gastado.toLocaleString("es-ES")} €
                  </td>
                  <td className="px-4 py-3 text-black/70">{usuario.alta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
