import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { FilterChipGroup } from "@/components/filter-chip-group";
import { PageHeader } from "@/components/page-header";
import { TimeRangeFilter } from "@/components/time-range-filter";
import { AlertFeed } from "@/components/alert-feed";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUpdatedAt } from "@/lib/format";
import { getAlerts, getPlants, getSeveritySummary } from "@/lib/mock-data";
import {
  buildHref,
  coerceAlertSeverity,
  coerceMetricKey,
  coercePlantId,
  coerceTimeRange,
} from "@/lib/url-state";
import type { AlertFilters } from "@/lib/types";

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string;
    plant?: string;
    severity?: string;
    metric?: string;
  }>;
}) {
  const params = await searchParams;
  const range = coerceTimeRange(params.range);
  const filters: AlertFilters = {
    timeRange: range,
    plantId: coercePlantId(params.plant),
    severity: coerceAlertSeverity(params.severity),
    metric: coerceMetricKey(params.metric),
  };
  const alerts = getAlerts(filters);
  const severity = getSeveritySummary(filters);
  const plants = getPlants();

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Bridgewater Anomaly Monitoring"
        title="Operational Alerts"
        description="Filter the Bridgewater network feed by facility, severity, and metric to isolate the alert stories that need action."
        actions={
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div className="rounded-full border border-[var(--color-border)] bg-white/72 px-4 py-2 text-sm text-[var(--color-muted-foreground)] shadow-[var(--shadow-panel)]">
              Updated {formatUpdatedAt(alerts[0]?.detectedAt ?? "2026-04-15T10:00:00Z")}
            </div>
            <TimeRangeFilter
              pathname="/alerts"
              currentRange={range}
              searchParams={params}
            />
          </div>
        }
      />

      <Card>
        <CardHeader className="gap-1">
          <CardTitle>Filter Alert Feed</CardTitle>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Narrow the feed without losing the active Bridgewater operating window.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <FilterChipGroup
            label="Facility"
            pathname="/alerts"
            searchParams={params}
            queryKey="plant"
            value={filters.plantId}
            options={[
              { label: "All facilities" },
              ...plants.map((plant) => ({
                label: plant.name,
                value: plant.id,
              })),
            ]}
          />
          <FilterChipGroup
            label="Severity"
            pathname="/alerts"
            searchParams={params}
            queryKey="severity"
            value={filters.severity}
            options={[
              { label: "All severities" },
              { label: "Critical", value: "critical" },
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
          />
          <FilterChipGroup
            label="Metric"
            pathname="/alerts"
            searchParams={params}
            queryKey="metric"
            value={filters.metric}
            options={[
              { label: "All metrics" },
              { label: "OEE", value: "oee" },
              { label: "Scrap", value: "scrapRate" },
              { label: "OTIF", value: "otif" },
              { label: "Inventory", value: "inventoryHealth" },
              { label: "Downtime", value: "downtime" },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4 p-6 pt-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Critical", value: severity.critical },
            { label: "High", value: severity.high },
            { label: "Medium", value: severity.medium },
            { label: "Low", value: severity.low },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[calc(var(--radius)*1.15)] border border-[var(--color-border)]/75 bg-white/72 px-4 py-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                {item.label}
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                {item.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
            Alert Feed
          </h3>
          {alerts.length > 0 ? (
            <AlertFeed
              alerts={alerts}
              showChart
              timeRange={range}
            />
          ) : (
            <EmptyState
              title="No alerts match the current filters"
              description="The current filter combination cleared the alert list. Reset one or more filters to bring the broader network story back into view."
              actions={
                <Link
                  href={buildHref("/alerts", params, {
                    plant: undefined,
                    severity: undefined,
                    metric: undefined,
                  })}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Reset alert filters
                </Link>
              }
            />
          )}
        </div>

        <Card className="h-fit xl:sticky xl:top-28">
          <CardHeader className="gap-1">
            <CardTitle>What matters most</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-[var(--color-muted-foreground)]">
            <p>
              Warren owns the sharpest operational risk right now because both
              downtime and scrap are degrading together.
            </p>
            <p>
              Lansing is a different kind of story: production is strong, but
              OTIF is slipping enough to create service pressure.
            </p>
            <p>
              Detroit should stay on watch for inventory imbalance before it
              turns into a broader delivery issue.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
