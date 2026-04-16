import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

import { AlertFeed } from "@/components/alert-feed";
import { DowntimeMixChart } from "@/components/charts/downtime-mix-chart";
import { InventorySignalList } from "@/components/inventory-signal-list";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { TimeRangeFilter } from "@/components/time-range-filter";
import { TrendChartCard } from "@/components/trend-chart-card";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatUpdatedAt } from "@/lib/format";
import { getPlantDetail, getPlantQuestions, getPlants } from "@/lib/mock-data";
import { buildHref, coerceTimeRange } from "@/lib/url-state";
import { cn } from "@/lib/utils";
import type { PlantDetailData } from "@/lib/types";

function plantSummaryBullets(detail: PlantDetailData) {
  const strongestMetric =
    detail.kpis.oee.value >= 0.82
      ? "OEE remains a relative strength for this facility."
      : "This facility does not have enough efficiency cushion to absorb more disruption.";
  const riskMetric =
    detail.alerts[0]?.title ??
    "No open alert currently outranks the normal operating watch items.";

  return [
    strongestMetric,
    riskMetric,
    "Use the query workspace to turn this facility story into a specific manager-facing question.",
  ];
}

export async function generateStaticParams() {
  return getPlants().map((plant) => ({
    plantId: plant.id,
  }));
}

export default async function PlantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ plantId: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { plantId } = await params;
  const search = await searchParams;
  const range = coerceTimeRange(search.range);
  const detail = getPlantDetail(plantId, range);
  const suggestedQuestions = getPlantQuestions(plantId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow={`${detail.plant.name} Facility Detail`}
        title={`${detail.plant.name} Performance Story`}
        description={detail.summary}
        actions={
          <div className="flex flex-col items-start gap-3">
            <div className="rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-sm text-[var(--color-muted-foreground)]">
              Updated {formatUpdatedAt(detail.updatedAt)}
            </div>
            <TimeRangeFilter
              pathname={`/plants/${detail.plant.id}`}
              currentRange={range}
              searchParams={search}
            />
          </div>
        }
      />

      <Card>
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_340px]">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[detail.plant.region, detail.plant.specialty, `Manager: ${detail.plant.manager}`].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--color-border)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]"
                >
                  {item}
                </span>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                Current shift status
              </p>
              <p className="mt-2 text-lg text-[var(--color-foreground)]">
                {detail.plant.shiftStatus}
              </p>
            </div>
          </div>

            <div className="rounded-[calc(var(--radius)*1.05)] bg-[var(--color-secondary)]/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                Manager-ready facility summary
              </p>
              <div className="mt-4 grid gap-3">
              {plantSummaryBullets(detail).map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-6 text-[var(--color-foreground)]"
                >
                  {bullet}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href={buildHref("/query", {}, {
                  range,
                  q: suggestedQuestions[0] ?? `Why does ${detail.plant.name} need attention?`,
                })}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-between",
                )}
              >
                Ask a follow-up question
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Object.values(detail.kpis).map((metric) => (
          <KpiCard key={metric.key} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TrendChartCard
          title="OEE Trend"
          description={`Efficiency trend for ${detail.plant.name}.`}
          metric="oee"
          data={detail.trends}
        />
        <TrendChartCard
          title="Scrap Trend"
          description="Yield loss pattern for the selected time window."
          metric="scrapRate"
          data={detail.trends}
        />
        <TrendChartCard
          title="OTIF Trend"
          description="Service reliability pattern for this plant."
          metric="otif"
          data={detail.trends}
        />
        <TrendChartCard
          title="Downtime Trend"
          description="Downtime minutes by day for the selected window."
          metric="downtime"
          data={detail.trends}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Downtime Mix</CardTitle>
            <CardDescription>
              Downtime categories contributing to the current facility story.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DowntimeMixChart data={detail.downtimeMix} />
          </CardContent>
        </Card>

        <InventorySignalList signals={detail.inventorySignals} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle>Facility-Scoped Follow-Up Prompts</CardTitle>
              <CardDescription>
                These links preserve the current range and prefill the AI workspace with facility-specific questions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          {suggestedQuestions.map((question) => (
            <Link
              key={question}
              href={buildHref("/query", {}, {
                range,
                q: question,
              })}
              className="rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-6 text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-secondary)]"
            >
              {question}
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
            Facility Alerts
          </h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Alerting stays scoped to the facility so leaders can move from summary to action without leaving context.
          </p>
        </div>
        <AlertFeed
          alerts={detail.alerts}
          showPlant={false}
          showChart
          timeRange={range}
        />
      </div>
    </div>
  );
}
