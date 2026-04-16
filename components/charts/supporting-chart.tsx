"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SupportingChart as SupportingChartData } from "@/lib/types";

export function SupportingChart({ chart }: { chart: SupportingChartData }) {
  const prepared = chart.series.map((point) => ({
    ...point,
    baseline: point.baseline ?? null,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chart.type === "line" ? (
          <LineChart data={prepared}>
            <defs>
              <linearGradient id="supporting-line-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#183b5a" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#183b5a" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 6"
              vertical={false}
              stroke="#d7dde6"
              strokeOpacity={0.7}
            />
            <XAxis
              dataKey="label"
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
              contentStyle={{
                borderRadius: 20,
                border: "1px solid #d7dde6",
                backgroundColor: "rgba(255,255,255,0.96)",
                boxShadow: "0 22px 48px -28px rgba(15,23,42,0.35)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#supporting-line-fill)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#183b5a"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#b68a52"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        ) : chart.type === "area" ? (
          <AreaChart data={prepared}>
            <defs>
              <linearGradient id="supporting-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#183b5a" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#183b5a" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 6"
              vertical={false}
              stroke="#d7dde6"
              strokeOpacity={0.7}
            />
            <XAxis
              dataKey="label"
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
              contentStyle={{
                borderRadius: 20,
                border: "1px solid #d7dde6",
                backgroundColor: "rgba(255,255,255,0.96)",
                boxShadow: "0 22px 48px -28px rgba(15,23,42,0.35)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#183b5a"
              fill="url(#supporting-area-fill)"
              strokeWidth={3}
            />
          </AreaChart>
        ) : (
          <BarChart data={prepared}>
            <CartesianGrid
              strokeDasharray="4 6"
              vertical={false}
              stroke="#d7dde6"
              strokeOpacity={0.7}
            />
            <XAxis
              dataKey="label"
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
              contentStyle={{
                borderRadius: 20,
                border: "1px solid #d7dde6",
                backgroundColor: "rgba(255,255,255,0.96)",
                boxShadow: "0 22px 48px -28px rgba(15,23,42,0.35)",
              }}
            />
            <Bar dataKey="value" fill="#183b5a" radius={[10, 10, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
