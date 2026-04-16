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

import type { DowntimeBucket } from "@/lib/types";

export function DowntimeMixChart({ data }: { data: DowntimeBucket[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <defs>
            <linearGradient id="downtime-bar-fill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b533f" />
              <stop offset="100%" stopColor="#b68a52" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 6"
            horizontal={false}
            stroke="#d7dde6"
            strokeOpacity={0.7}
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tick={{ fill: "#6a7688", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6a7688", fontSize: 12 }}
            width={110}
          />
          <Tooltip
            formatter={(value: number) => [`${Math.round(value)} min`, "Downtime"]}
            contentStyle={{
              borderRadius: 20,
              border: "1px solid #d7dde6",
              backgroundColor: "rgba(255,255,255,0.96)",
              boxShadow: "0 22px 48px -28px rgba(15,23,42,0.35)",
            }}
          />
          <Bar dataKey="minutes" radius={[0, 10, 10, 0]} fill="url(#downtime-bar-fill)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
