"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const meses = ["Feb", "Mar", "Abr", "May", "Jun", "Jul"];

const cursos = [
  {
    curso: "Domina el Diseño UX/UI desde Cero",
    visualizaciones: 4832,
    rewatches: 312,
    ingresos: 9506,
    comprasPorMes: [18, 24, 31, 27, 35, 42],
  },
  {
    curso: "Marketing Digital para Emprendedores",
    visualizaciones: 3120,
    rewatches: 154,
    ingresos: 6162,
    comprasPorMes: [12, 15, 14, 20, 18, 21],
  },
  {
    curso: "Introducción a la Programación Web",
    visualizaciones: 6710,
    rewatches: 487,
    ingresos: 11210,
    comprasPorMes: [22, 28, 33, 41, 38, 48],
  },
  {
    curso: "Fotografía para Redes Sociales",
    visualizaciones: 1954,
    rewatches: 76,
    ingresos: 2691,
    comprasPorMes: [6, 8, 7, 10, 9, 12],
  },
];

const estadisticas = cursos.map((curso) => ({
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
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={item.data}>
                      <CartesianGrid stroke="#00000020" vertical={false} />
                      <XAxis
                        dataKey="mes"
                        stroke="#000000"
                        tick={{ fill: "#000000", fontSize: 12 }}
                        axisLine={{ stroke: "#000000" }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#000000"
                        tick={{ fill: "#000000", fontSize: 12 }}
                        axisLine={{ stroke: "#000000" }}
                        tickLine={false}
                        width={32}
                      />
                      <Tooltip
                        cursor={{ fill: "#00000010" }}
                        contentStyle={{
                          background: "#ffffff",
                          border: "1px solid #000000",
                          borderRadius: 0,
                          fontSize: 12,
                        }}
                        labelStyle={{ color: "#000000", fontWeight: 600 }}
                      />
                      <Bar dataKey="compras" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
