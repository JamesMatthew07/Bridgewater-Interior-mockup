"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatMetricValue } from "@/lib/format";
import { METRIC_META } from "@/lib/site";
import type { MetricKey, TimeSeriesPoint } from "@/lib/types";

export function MetricTrendChart({
  data,
  metric,
}: {
  data: TimeSeriesPoint[];
  metric: MetricKey;
}) {
  const meta = METRIC_META[metric];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
          <defs>
            <linearGradient id={`metric-fill-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.accent} stopOpacity={0.24} />
              <stop offset="100%" stopColor={meta.accent} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 6"
            vertical={false}
            stroke="#d9e0ea"
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
            tickFormatter={(value: number) => {
              return metric === "downtime"
                ? `${Math.round(value)}`
                : `${Math.round(value * 100)}%`;
            }}
          />
          <Tooltip
            cursor={{ stroke: "#cfd8e3", strokeDasharray: "4 4" }}
            formatter={(value: number) => formatMetricValue(metric, value)}
            contentStyle={{
              borderRadius: 20,
              border: "1px solid #d7dde6",
              backgroundColor: "rgba(255,255,255,0.96)",
              boxShadow: "0 22px 48px -28px rgba(15,23,42,0.35)",
            }}
            labelStyle={{ color: "#334155", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={meta.accent}
            fill={`url(#metric-fill-${metric})`}
            strokeWidth={3}
            dot={{ r: 0 }}
            activeDot={{ r: 5, fill: meta.accent }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
