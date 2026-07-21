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

export function CourseBarChart({
  data,
}: {
  data: { mes: string; compras: number }[];
}) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
  );
}
