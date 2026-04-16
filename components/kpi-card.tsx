import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMetricDelta, formatMetricValue } from "@/lib/format";
import { METRIC_META } from "@/lib/site";
import type { KpiMetric } from "@/lib/types";

function metricTone(metric: KpiMetric) {
  const improvesWhen = METRIC_META[metric.key].improvesWhen;
  const delta = metric.changeVsPrior;

  if (delta === 0) {
    return "neutral";
  }

  if ((improvesWhen === "up" && delta > 0) || (improvesWhen === "down" && delta < 0)) {
    return "positive";
  }

  return "negative";
}

const TONE_META = {
  positive: {
    label: "Improving",
    accent: "var(--color-risk-low)",
    glow: "rgba(83, 153, 110, 0.16)",
  },
  negative: {
    label: "Needs focus",
    accent: "var(--color-risk-critical)",
    glow: "rgba(196, 76, 48, 0.16)",
  },
  neutral: {
    label: "Stable",
    accent: "var(--color-muted-foreground)",
    glow: "rgba(100, 117, 139, 0.12)",
  },
} as const;

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const tone = metricTone(metric);
  const Icon =
    metric.changeVsPrior === 0 ? Minus : metric.changeVsPrior > 0 ? ArrowUpRight : ArrowDownRight;
  const toneMeta = TONE_META[tone];

  return (
    <Card className="h-full">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${toneMeta.accent}, transparent 82%)`,
        }}
      />
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
              {metric.label}
            </CardTitle>
            <p className="text-4xl font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
              {formatMetricValue(metric.key, metric.value)}
            </p>
          </div>

          <span
            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{
              color: toneMeta.accent,
              backgroundColor: toneMeta.glow,
            }}
          >
            {toneMeta.label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span
            className="inline-flex items-center gap-1"
            style={{ color: toneMeta.accent }}
          >
            <Icon className="h-4 w-4" />
            {formatMetricDelta(metric.key, metric.changeVsPrior)}
          </span>
          <span className="text-[var(--color-muted-foreground)]">vs prior window</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
          {metric.narrative}
        </p>
      </CardContent>
    </Card>
  );
}
