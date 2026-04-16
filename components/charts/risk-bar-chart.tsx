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

import type { ComparisonRow } from "@/lib/types";

export function RiskBarChart({ data }: { data: ComparisonRow[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="risk-bar-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#183b5a" />
              <stop offset="100%" stopColor="#6a7e8f" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 6"
            vertical={false}
            stroke="#d7dde6"
            strokeOpacity={0.7}
          />
          <XAxis
            dataKey="plantName"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fill: "#6a7688", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fill: "#6a7688", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(230,236,243,0.5)" }}
            formatter={(value: number) => [`${value}`, "Risk score"]}
            contentStyle={{
              borderRadius: 20,
              border: "1px solid #d7dde6",
              backgroundColor: "rgba(255,255,255,0.96)",
              boxShadow: "0 22px 48px -28px rgba(15,23,42,0.35)",
            }}
          />
          <Bar dataKey="riskIndex" radius={[10, 10, 0, 0]} fill="url(#risk-bar-fill)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
