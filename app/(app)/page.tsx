import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { AlertFeed } from "@/components/alert-feed";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { PlantComparisonTable } from "@/components/plant-comparison-table";
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
import { Separator } from "@/components/ui/separator";
import { formatTimeRangeLabel, formatUpdatedAt } from "@/lib/format";
import { getOverviewData } from "@/lib/mock-data";
import {
  APP_COMPANY,
  APP_MOTTO,
  BRIDGEWATER_CAPABILITIES,
  BRIDGEWATER_RECOGNITIONS,
  BRIDGEWATER_SNAPSHOT,
} from "@/lib/site";
import { buildHref, coerceTimeRange } from "@/lib/url-state";
import { cn } from "@/lib/utils";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = coerceTimeRange(params.range);
  const data = getOverviewData(range);
  const leadInsight = data.insights[0];

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow={`${APP_COMPANY} Network Overview`}
        title="Bridgewater Network Command View"
        description="An operations cockpit for Bridgewater's Detroit-headquartered seating and interior systems network, grounded in real facility identity and public company context."
        actions={
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div className="rounded-full border border-[var(--color-border)] bg-white/72 px-4 py-2 text-sm text-[var(--color-muted-foreground)] shadow-[var(--shadow-panel)]">
              Updated {formatUpdatedAt(data.updatedAt)}
            </div>
            <TimeRangeFilter pathname="/" currentRange={range} searchParams={params} />
          </div>
        }
      />

      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-6 pt-6 lg:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">
                Network priority
              </p>
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
                {leadInsight.title}
              </h3>
              <p className="max-w-3xl text-base leading-8 text-[var(--color-muted-foreground)]">
                {leadInsight.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {leadInsight.plantIds[0] ? (
                <Link
                  href={buildHref(`/plants/${leadInsight.plantIds[0]}`, {}, {
                    range,
                  })}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  View facility story
                </Link>
              ) : null}
              <Link
                href={buildHref("/query", params, {
                  range,
                  q: leadInsight.question,
                })}
                className={cn(buttonVariants({ variant: "outline" }), "bg-white/82")}
              >
                {leadInsight.ctaLabel}
              </Link>
            </div>
          </div>

          <div className="rounded-[calc(var(--radius)*1.2)] border border-[var(--color-border)]/75 bg-[linear-gradient(180deg,rgba(245,247,248,0.95),rgba(232,237,241,0.88))] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">
              Current attention order
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--color-foreground)]">
              {formatTimeRangeLabel(range)}
            </p>
            <Separator className="my-4" />
            <div className="grid gap-3">
              {data.comparison.slice(0, 3).map((row, index) => (
                <div
                  key={row.plantId}
                  className="flex items-center justify-between gap-3 rounded-[calc(var(--radius)*1.05)] bg-white/72 px-4 py-3"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
                      Rank {index + 1}
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {row.plantName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
                      Risk
                    </p>
                    <p className="text-lg font-semibold text-[var(--color-foreground)]">
                      {row.riskIndex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
              <ArrowUpRight className="h-4 w-4 text-[var(--color-primary)]" />
              Ranking, alerts, and AI prompts stay aligned to the selected Bridgewater operating window.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <Card>
          <CardHeader className="gap-1">
            <CardTitle>Bridgewater Snapshot</CardTitle>
            <CardDescription>
              Public-company context layered over the current Bridgewater operating story.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
            <div className="grid gap-3 sm:grid-cols-2">
              {BRIDGEWATER_SNAPSHOT.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[calc(var(--radius)*1.15)] border border-[var(--color-border)]/75 bg-white/72 px-4 py-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-base font-semibold text-[var(--color-foreground)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="rounded-[calc(var(--radius)*1.15)] border border-[var(--color-border)]/75 bg-[linear-gradient(180deg,rgba(24,59,90,0.06),rgba(182,138,82,0.08))] px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
                {APP_MOTTO}
              </p>
              <div className="mt-4 grid gap-3">
                {BRIDGEWATER_CAPABILITIES.map((capability) => (
                  <div
                    key={capability}
                    className="rounded-[calc(var(--radius)*1.05)] bg-white/78 px-4 py-3 text-sm leading-6 text-[var(--color-foreground)]"
                  >
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-1">
            <CardTitle>Current Public Signals</CardTitle>
            <CardDescription>
              Recognition and company-context cues that help the workspace feel native to Bridgewater.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {BRIDGEWATER_RECOGNITIONS.map((item) => (
              <div
                key={item.title}
                className="rounded-[calc(var(--radius)*1.15)] border border-[var(--color-border)]/75 bg-white/72 px-4 py-4"
              >
                <p className="text-sm font-semibold text-[var(--color-foreground)]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
                >
                  View public source
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
            <div className="rounded-[calc(var(--radius)*1.12)] bg-[var(--color-secondary)]/72 px-4 py-4 text-sm leading-6 text-[var(--color-muted-foreground)]">
              Facility identity, company facts, and recognitions are real-public context. KPI values, alerts, and attention scores are presented as a scenario view for stakeholder review.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
          Selected KPIs
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Bridgewater operating posture for the active time range.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Object.values(data.kpis).map((metric) => (
          <KpiCard key={metric.key} metric={metric} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facility Comparison</CardTitle>
          <CardDescription>
            Bridgewater facility ranking by current KPI posture, active alerts, and attention scoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlantComparisonTable rows={data.comparison} timeRange={range} />
        </CardContent>
      </Card>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
          Trend watch
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          KPI movement across the Bridgewater network for the selected window.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TrendChartCard
          title="OEE Trend"
          description="Average OEE across the four plants for the selected window."
          metric="oee"
          data={data.trends}
        />
        <TrendChartCard
          title="Scrap Trend"
          description="Quality loss trend across the network."
          metric="scrapRate"
          data={data.trends}
        />
        <TrendChartCard
          title="OTIF Trend"
          description="Service reliability across the network."
          metric="otif"
          data={data.trends}
        />
        <TrendChartCard
          title="Downtime Trend"
          description="Average downtime minutes across plants."
          metric="downtime"
          data={data.trends}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
              Active Alerts
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Alert stories are aligned to Bridgewater&apos;s real facility footprint and operating context.
            </p>
          </div>
          <AlertFeed
            alerts={data.alerts}
            limit={3}
            timeRange={range}
          />
        </div>

        <Card>
          <CardHeader className="gap-1">
            <CardTitle>AI Follow-Up Prompts</CardTitle>
            <CardDescription>
              Launch the query workspace with Bridgewater-specific questions tied to the current storylines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.insights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-[calc(var(--radius)*1.15)] border border-[var(--color-border)] bg-white/72 px-4 py-4"
              >
                <p className="text-sm font-semibold text-[var(--color-foreground)]">
                  {insight.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
                  {insight.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {insight.plantIds[0] ? (
                    <Link
                      href={buildHref(`/plants/${insight.plantIds[0]}`, {}, {
                        range,
                      })}
                      className={buttonVariants({ variant: "secondary", size: "sm" })}
                    >
                      View facility story
                    </Link>
                  ) : null}
                  <Link
                    href={buildHref("/query", params, {
                      range,
                      q: insight.question,
                    })}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "bg-white/80",
                    )}
                  >
                    {insight.ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
