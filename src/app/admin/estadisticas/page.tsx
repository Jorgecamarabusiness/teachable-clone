import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseBarChart } from "./CourseBarChart";
import { courseStats, mesesEstadisticas as meses } from "@/lib/mock-data";

const estadisticas = courseStats.map((curso) => ({
  ...curso,
  totalCompras: curso.comprasPorMes.reduce((a, b) => a + b, 0),
  data: curso.comprasPorMes.map((compras, index) => ({
    mes: meses[index],
    compras,
  })),
}));

const ingresosTotales = estadisticas.reduce((a, c) => a + c.ingresos, 0);
const cursoMasPopular = estadisticas.reduce((max, curso) =>
  curso.totalCompras > max.totalCompras ? curso : max,
);
const rewatchesTotales = estadisticas.reduce((a, c) => a + c.rewatches, 0);

export default function EstadisticasPage() {
  return (
    <div className="flex flex-1 flex-col bg-white text-black">
      <Header />

      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Estadísticas</h1>
        <p className="mt-2 text-sm text-black/70">
          Rendimiento de cada curso publicado.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="border border-black p-6">
            <p className="text-sm text-black/70">Ingresos totales</p>
            <p className="mt-2 text-2xl font-bold">
              {ingresosTotales.toLocaleString("es-ES")} €
            </p>
          </div>
          <div className="border border-black p-6">
            <p className="text-sm text-black/70">Curso más popular</p>
            <p className="mt-2 text-lg font-bold leading-snug">
              {cursoMasPopular.curso}
            </p>
          </div>
          <div className="border border-black p-6">
            <p className="text-sm text-black/70">Rewatches totales</p>
            <p className="mt-2 text-2xl font-bold">
              {rewatchesTotales.toLocaleString("es-ES")}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {estadisticas.map((item) => (
            <div
              key={item.curso}
              className="flex flex-col gap-4 border border-black p-6"
            >
              <h2 className="text-lg font-semibold leading-snug">
                {item.curso}
              </h2>

              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-black/70">Visualizaciones</p>
                  <p className="font-semibold">
                    {item.visualizaciones.toLocaleString("es-ES")}
                  </p>
                </div>
                <div>
                  <p className="text-black/70">Rewatches</p>
                  <p className="font-semibold">
                    {item.rewatches.toLocaleString("es-ES")}
                  </p>
                </div>
                <div>
                  <p className="text-black/70">Ingresos</p>
                  <p className="font-semibold">
                    {item.ingresos.toLocaleString("es-ES")} €
                  </p>
                </div>
                <div>
                  <p className="text-black/70">Compras (6 meses)</p>
                  <p className="font-semibold">{item.totalCompras}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-black/70">
                  Compras nuevas por mes
                </p>
                <CourseBarChart data={item.data} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
