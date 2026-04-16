import { METRIC_META, TIME_RANGE_OPTIONS } from "@/lib/site";
import type { AlertSeverity, MetricKey, TimeRange } from "@/lib/types";

export function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatMetricValue(metric: MetricKey, value: number) {
  switch (METRIC_META[metric].unit) {
    case "percent":
      return formatPercent(value);
    case "minutes":
      return `${Math.round(value)} min`;
    case "score":
      return `${Math.round(value * 100)}/100`;
    default:
      return value.toString();
  }
}

export function formatMetricDelta(metric: MetricKey, value: number) {
  const sign = value > 0 ? "+" : "";
  switch (METRIC_META[metric].unit) {
    case "percent":
      return `${sign}${(value * 100).toFixed(1)} pts`;
    case "minutes":
      return `${sign}${Math.round(value)} min`;
    case "score":
      return `${sign}${Math.round(value * 100)} pts`;
    default:
      return `${sign}${value}`;
  }
}

export function formatTimeRangeLabel(timeRange: TimeRange) {
  return (
    TIME_RANGE_OPTIONS.find((option) => option.value === timeRange)?.label ??
    timeRange
  );
}

export function formatUpdatedAt(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function severityLabel(severity: AlertSeverity) {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}
