import {
  formatMetricDelta,
  formatMetricValue,
  formatPercent,
  formatTimeRangeLabel,
  severityLabel,
} from "@/lib/format";
import {
  getAlerts,
  getOverviewData,
  getPlantDetail,
  getPlants,
  resolvePlantIdsFromQuestion,
} from "@/lib/mock-data";
import { METRIC_META } from "@/lib/site";
import type {
  AlertSeverity,
  DataSource,
  KpiMetric,
  MetricKey,
  QueryGrounding,
  QueryRequest,
  RetrievedContextItem,
  RetrievedContextKind,
  TimeRange,
} from "@/lib/types";

interface RagDocument extends RetrievedContextItem {
  searchText: string;
}

const STOP_WORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "did",
  "do",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "last",
  "me",
  "of",
  "on",
  "or",
  "show",
  "the",
  "this",
  "today",
  "what",
  "when",
  "which",
  "why",
  "with",
  "yesterday",
]);

const METRIC_TERMS: Record<MetricKey, string[]> = {
  oee: ["oee", "efficiency", "throughput", "availability", "performance"],
  scrapRate: ["scrap", "quality", "yield", "reject", "rework"],
  otif: ["otif", "delivery", "deliveries", "orders", "shipment", "service"],
  inventoryHealth: [
    "inventory",
    "stock",
    "component",
    "components",
    "coverage",
    "planner",
    "material",
    "supply",
  ],
  downtime: [
    "downtime",
    "maintenance",
    "tooling",
    "changeover",
    "stoppage",
    "stop",
    "breakdown",
  ],
};

const KIND_TERMS: Partial<Record<RetrievedContextKind, string[]>> = {
  alert: ["alert", "alerts", "driver", "drivers", "baseline", "escalation"],
  trend: ["trend", "trends", "show", "changed", "change", "week", "window"],
  inventory: ["inventory", "stock", "coverage", "planner", "component"],
  downtime: ["downtime", "maintenance", "tooling", "changeover"],
  network: ["network", "site", "sites", "compare", "comparison", "priority"],
};

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function tokenize(text: string) {
  return unique(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .map((token) => token.trim())
      .filter((token) => token.length > 1 && !STOP_WORDS.has(token)),
  );
}

function resolveMetricMatches(question: string) {
  const normalized = question.toLowerCase();

  return (Object.entries(METRIC_TERMS) as Array<[MetricKey, string[]]>)
    .filter(([, terms]) => terms.some((term) => normalized.includes(term)))
    .map(([metric]) => metric);
}

function getMetricSources(metric: MetricKey): DataSource[] {
  switch (metric) {
    case "downtime":
      return ["CMMS", "MES"];
    case "otif":
      return ["ERP", "MES"];
    case "inventoryHealth":
      return ["ERP"];
    case "scrapRate":
      return ["MES", "CMMS"];
    case "oee":
    default:
      return ["MES", "CMMS"];
  }
}

function metricRankValue(metric: MetricKey, value: number) {
  return METRIC_META[metric].improvesWhen === "down" ? -value : value;
}

function buildSearchText(item: RetrievedContextItem) {
  return [
    item.title,
    item.summary,
    item.plantName,
    item.metric ? METRIC_META[item.metric].label : "",
    item.severity ?? "",
    item.kind,
    item.sources.join(" "),
  ].join(" ");
}

function toDocument(item: RetrievedContextItem): RagDocument {
  return {
    ...item,
    searchText: buildSearchText(item),
  };
}

function describeMetric(metric: KpiMetric) {
  return `${metric.label} ${formatMetricValue(metric.key, metric.value)} (${formatMetricDelta(
    metric.key,
    metric.changeVsPrior,
  )} vs prior window)`;
}

function buildRagDocuments(timeRange: TimeRange): RagDocument[] {
  const overview = getOverviewData(timeRange);
  const plants = getPlants();
  const alerts = getAlerts();
  const documents: RagDocument[] = [];

  const topRisk = overview.comparison[0];
  const secondRisk = overview.comparison[1];
  documents.push(
    toDocument({
      id: `network-priority-${timeRange}`,
      kind: "network",
      title: `Network priority snapshot for ${formatTimeRangeLabel(timeRange)}`,
      summary: `${topRisk?.plantName ?? "Warren, MI"} is the top risk site with a risk index of ${topRisk?.riskIndex ?? 0}, followed by ${secondRisk?.plantName ?? "Detroit, MI"}.`,
      sources: ["MES", "ERP", "CMMS"],
    }),
  );

  for (const metric of Object.keys(METRIC_META) as MetricKey[]) {
    const ordered = [...overview.comparison].sort(
      (left, right) =>
        metricRankValue(metric, right[metric]) - metricRankValue(metric, left[metric]),
    );
    const leader = ordered[0];
    const trailer = ordered.at(-1);

    documents.push(
      toDocument({
        id: `network-${metric}-${timeRange}`,
        kind: "network",
        title: `${METRIC_META[metric].shortLabel} comparison across plants`,
        summary: `${leader.plantName} is strongest on ${METRIC_META[metric].shortLabel} at ${formatMetricValue(metric, leader[metric])}, while ${trailer?.plantName ?? leader.plantName} is weakest at ${formatMetricValue(metric, trailer?.[metric] ?? leader[metric])}.`,
        metric,
        sources: getMetricSources(metric),
      }),
    );
  }

  for (const insight of overview.insights) {
    documents.push(
      toDocument({
        id: insight.id,
        kind: "insight",
        title: insight.title,
        summary: insight.summary,
        plantId: insight.plantIds[0],
        plantName:
          overview.comparison.find((plant) => plant.plantId === insight.plantIds[0])
            ?.plantName ?? undefined,
        sources: insight.sources,
      }),
    );
  }

  for (const plant of plants) {
    const detail = getPlantDetail(plant.id, timeRange);

    if (!detail) {
      continue;
    }

    const [firstTrend] = detail.trends;
    const lastTrend = detail.trends.at(-1) ?? firstTrend;
    const topInventorySignal = detail.inventorySignals[0];
    const topDowntimeBucket = [...detail.downtimeMix].sort(
      (left, right) => right.minutes - left.minutes,
    )[0];

    documents.push(
      toDocument({
        id: `plant-kpis-${plant.id}-${timeRange}`,
        kind: "plant",
        title: `${plant.name} KPI snapshot`,
        summary: `${plant.summary} Current window metrics: ${describeMetric(detail.kpis.oee)}; ${describeMetric(detail.kpis.scrapRate)}; ${describeMetric(detail.kpis.otif)}; ${describeMetric(detail.kpis.inventoryHealth)}; ${describeMetric(detail.kpis.downtime)}.`,
        plantId: plant.id,
        plantName: plant.name,
        sources: detail.sources,
      }),
    );

    documents.push(
      toDocument({
        id: `plant-trend-${plant.id}-${timeRange}`,
        kind: "trend",
        title: `${plant.name} trend direction`,
        summary: `${plant.name} moved from OEE ${formatPercent(firstTrend.oee)} to ${formatPercent(lastTrend.oee)}, scrap ${formatPercent(firstTrend.scrapRate)} to ${formatPercent(lastTrend.scrapRate)}, OTIF ${formatPercent(firstTrend.otif)} to ${formatPercent(lastTrend.otif)}, and downtime ${Math.round(firstTrend.downtime)} min to ${Math.round(lastTrend.downtime)} min across the selected window.`,
        plantId: plant.id,
        plantName: plant.name,
        sources: ["MES", "ERP", "CMMS"],
      }),
    );

    documents.push(
      toDocument({
        id: `inventory-${plant.id}-${timeRange}`,
        kind: "inventory",
        title: `${plant.name} inventory signals`,
        summary: `${topInventorySignal.label} is ${topInventorySignal.value}${topInventorySignal.unit === "%" ? "%" : ""} against a target of ${topInventorySignal.target}${topInventorySignal.unit === "%" ? "%" : ""}. ${detail.inventorySignals.map((signal) => signal.narrative).join(" ")}`,
        plantId: plant.id,
        plantName: plant.name,
        metric: "inventoryHealth",
        sources: ["ERP"],
      }),
    );

    documents.push(
      toDocument({
        id: `downtime-${plant.id}-${timeRange}`,
        kind: "downtime",
        title: `${plant.name} downtime mix`,
        summary: `${topDowntimeBucket.category} is the biggest downtime bucket at ${plant.name} with ${topDowntimeBucket.minutes} minutes. Other drivers include ${detail.downtimeMix
          .slice(1)
          .map((bucket) => `${bucket.category} (${bucket.minutes} min)`)
          .join(", ")}.`,
        plantId: plant.id,
        plantName: plant.name,
        metric: "downtime",
        sources: ["CMMS", "MES"],
      }),
    );
  }

  for (const alert of alerts) {
    documents.push(
      toDocument({
        id: alert.id,
        kind: "alert",
        title: `${alert.plantName}: ${alert.title}`,
        summary: `${severityLabel(alert.severity)} ${METRIC_META[alert.metric].shortLabel} alert. ${alert.summary} Change vs baseline: ${formatMetricDelta(alert.metric, alert.changeVsBaseline)}. Main drivers: ${alert.drivers.join(", ")}.`,
        plantId: alert.plantId,
        plantName: alert.plantName,
        metric: alert.metric,
        severity: alert.severity,
        sources: alert.sources,
      }),
    );
  }

  return documents;
}

function kindBoost(kind: RetrievedContextKind, question: string) {
  const normalized = question.toLowerCase();
  const terms = KIND_TERMS[kind] ?? [];

  return terms.some((term) => normalized.includes(term)) ? 8 : 0;
}

function severityBoost(severity: AlertSeverity | undefined) {
  switch (severity) {
    case "critical":
      return 6;
    case "high":
      return 4;
    case "medium":
      return 2;
    default:
      return 0;
  }
}

function scoreDocument(
  document: RagDocument,
  question: string,
  questionTokens: string[],
  plantIds: string[],
  metricMatches: MetricKey[],
) {
  const searchTokens = tokenize(document.searchText);
  const overlap = questionTokens.filter((token) => searchTokens.includes(token));
  let score = overlap.length * 4;

  if (document.plantId && plantIds.includes(document.plantId)) {
    score += 20;
  }

  if (!document.plantId && plantIds.length === 0 && document.kind === "network") {
    score += 6;
  }

  if (document.metric && metricMatches.includes(document.metric)) {
    score += 16;
  }

  score += kindBoost(document.kind, question);
  score += severityBoost(document.severity);

  if (question.toLowerCase().includes("why")) {
    if (document.kind === "alert" || document.kind === "trend") {
      score += 5;
    }
  }

  if (
    question.toLowerCase().includes("show") ||
    question.toLowerCase().includes("trend")
  ) {
    if (document.kind === "trend") {
      score += 5;
    }
  }

  return score;
}

function buildDefaultGrounding(timeRange: TimeRange) {
  const documents = buildRagDocuments(timeRange);
  const defaults = documents.filter((document) =>
    [
      `network-priority-${timeRange}`,
      `plant-kpis-plant-2-${timeRange}`,
      "alert-plant-2-scrap",
      "alert-plant-2-downtime",
    ].includes(document.id),
  );

  return defaults.map(({ searchText: _searchText, ...item }) => item);
}

export function retrieveMockDataContext(request: QueryRequest): QueryGrounding {
  const timeRange = request.timeRange ?? "last_7_days";
  const questionTokens = tokenize(request.question);
  const metricMatches = resolveMetricMatches(request.question);
  const plantIds = resolvePlantIdsFromQuestion(request.question, request.plantIds);
  const documents = buildRagDocuments(timeRange);

  const items = documents
    .map((document) => ({
      document,
      score: scoreDocument(
        document,
        request.question,
        questionTokens,
        plantIds,
        metricMatches,
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 6)
    .map(({ document }) => {
      const { searchText: _searchText, ...item } = document;
      return item;
    });

  return {
    scope: "mock_data",
    strategy: "keyword_rag",
    items: items.length > 0 ? items : buildDefaultGrounding(timeRange),
  };
}
