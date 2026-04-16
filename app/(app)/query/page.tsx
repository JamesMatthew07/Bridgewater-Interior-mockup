import { buildFallbackQueryResponse } from "@/lib/ai/query-context";
import { PageHeader } from "@/components/page-header";
import { QueryWorkbench } from "@/components/query-workbench";
import { TimeRangeFilter } from "@/components/time-range-filter";
import { getQueryPresets } from "@/lib/mock-data";
import { coerceQuestion, coerceTimeRange } from "@/lib/url-state";

export default async function QueryPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; q?: string }>;
}) {
  const params = await searchParams;
  const presets = getQueryPresets();
  const range = coerceTimeRange(params.range);
  const initialQuestion =
    coerceQuestion(params.q) ??
    presets[0]?.question ??
    "Which Bridgewater facility needs attention first today?";
  const initialResponse = buildFallbackQueryResponse({
    question: initialQuestion,
    timeRange: range,
  });

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Bridgewater Natural-Language Analysis"
        title="Ask Bridgewater Operations Questions In Plain English"
        description="Ask grounded questions across KPI, alert, facility, and trend data, then review the evidence behind the answer."
        actions={
          <TimeRangeFilter
            pathname="/query"
            currentRange={range}
            searchParams={params}
          />
        }
      />
      <QueryWorkbench
        key={`${range}:${initialQuestion}`}
        presets={presets}
        initialQuestion={initialQuestion}
        initialRange={range}
        initialResponse={initialResponse}
        initialSearchParams={params}
        autoRunFromUrl={Boolean(coerceQuestion(params.q))}
      />
    </div>
  );
}
