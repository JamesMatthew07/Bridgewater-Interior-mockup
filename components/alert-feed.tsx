import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { SupportingChart } from "@/components/charts/supporting-chart";
import { AlertSeverityBadge } from "@/components/alert-severity-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMetricDelta, formatUpdatedAt } from "@/lib/format";
import { METRIC_META } from "@/lib/site";
import { buildHref } from "@/lib/url-state";
import { cn } from "@/lib/utils";
import type { Alert, TimeRange } from "@/lib/types";

export function AlertFeed({
  alerts,
  showPlant = true,
  showChart = false,
  limit,
  timeRange = "last_7_days",
  showActions = true,
}: {
  alerts: Alert[];
  showPlant?: boolean;
  showChart?: boolean;
  limit?: number;
  timeRange?: TimeRange;
  showActions?: boolean;
}) {
  const visibleAlerts = typeof limit === "number" ? alerts.slice(0, limit) : alerts;
  const severityAccents = {
    critical: "var(--color-risk-critical)",
    high: "var(--color-risk-high)",
    medium: "var(--color-risk-medium)",
    low: "var(--color-risk-low)",
  } as const;

  return (
    <div className="grid gap-4">
      {visibleAlerts.map((alert) => (
        <Card key={alert.id} className="overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-1.5"
            style={{ backgroundColor: severityAccents[alert.severity] }}
          />
          <CardContent className="grid gap-6 p-6 pt-6 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="space-y-5 pl-2">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <AlertSeverityBadge severity={alert.severity} />
                  <span className="rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
                    {METRIC_META[alert.metric].shortLabel}
                  </span>
                  {showPlant ? (
                    <Link
                      href={buildHref(`/plants/${alert.plantId}`, {}, {
                        range: timeRange,
                      })}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]"
                    >
                      {alert.plantName}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">{alert.title}</CardTitle>
                  <CardDescription className="max-w-3xl">{alert.summary}</CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {alert.drivers.map((driver) => (
                  <span
                    key={driver}
                    className="rounded-full bg-[var(--color-secondary)]/78 px-3 py-1.5 text-xs font-medium text-[var(--color-muted-foreground)]"
                  >
                    {driver}
                  </span>
                ))}
              </div>

              {showActions ? (
                <div className="flex flex-wrap gap-3">
                  <Link
                  href={buildHref(`/plants/${alert.plantId}`, {}, { range: timeRange })}
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                    View facility
                  </Link>
                  <Link
                    href={buildHref("/query", {}, {
                      q: `Explain the ${METRIC_META[alert.metric].shortLabel} alert for ${alert.plantName}.`,
                      range: timeRange,
                    })}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "bg-white/80",
                    )}
                  >
                    Ask AI about this alert
                  </Link>
                </div>
              ) : null}

              {showChart ? (
                <div className="rounded-[calc(var(--radius)*1.2)] border border-[var(--color-border)]/75 bg-white/62 p-4">
                  <SupportingChart
                    chart={{
                      type: "line",
                      title: alert.title,
                      series: alert.chartPoints,
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-4 rounded-[calc(var(--radius)*1.2)] border border-[var(--color-border)]/75 bg-[var(--color-secondary)]/72 p-5 lg:h-fit">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
                Alert snapshot
              </p>

              <div className="space-y-1">
                <p className="text-sm text-[var(--color-muted-foreground)]">Delta vs baseline</p>
                <p className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-foreground)]">
                  {formatMetricDelta(alert.metric, alert.changeVsBaseline)}
                </p>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-[var(--color-muted-foreground)]">Detected</p>
                <p className="inline-flex items-center gap-2 font-medium text-[var(--color-foreground)]">
                  <Clock3 className="h-4 w-4 text-[var(--color-primary)]" />
                  {formatUpdatedAt(alert.detectedAt)}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-[var(--color-muted-foreground)]">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {alert.sources.map((source) => (
                    <span
                      key={`${alert.id}-${source}`}
                      className="rounded-full border border-[var(--color-border)] bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
