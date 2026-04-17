import { retrieveMockDataContext } from "@/lib/ai/mock-data-rag";
import {
  answerQuestion,
  getAlerts,
  getOverviewData,
  getPlantById,
  getPlantDetail,
  resolvePlantIdsFromQuestion,
} from "@/lib/mock-data";
import type { QueryRequest, QueryResponse, TimeRange } from "@/lib/types";

export const DEFAULT_QUERY_TIME_RANGE: TimeRange = "last_30_days";

const HIGH_SIGNAL_SCOPE_TERMS = [
  "alert",
  "alerts",
  "attention",
  "benchmark",
  "bridgewater",
  "changeover",
  "cmms",
  "compare",
  "comparison",
  "coverage",
  "downtime",
  "driver",
  "drivers",
  "erp",
  "inventory",
  "kitting",
  "kpi",
  "kpis",
  "loss",
  "losses",
  "maintenance",
  "material",
  "mes",
  "network",
  "oee",
  "otif",
  "planner",
  "priority",
  "rank",
  "ranking",
  "rework",
  "risk",
  "scrap",
  "sequence",
  "sequencing",
  "stoppage",
  "supply",
  "throughput",
  "tooling",
  "trend",
  "trends",
  "trim",
  "yield",
] as const;

const CONTEXT_SCOPE_TERMS = [
  "assembly",
  "dashboard",
  "delivery",
  "deliveries",
  "facility",
  "facilities",
  "line",
  "lines",
  "operations",
  "operating",
  "order",
  "orders",
  "outbound",
  "performance",
  "plant",
  "plants",
  "quality",
  "service",
  "shift",
  "shipment",
  "shipments",
  "site",
  "sites",
] as const;

export interface QueryContextSnapshot {
  question: string;
  timeRange: TimeRange;
  plantIds: string[];
  overview: ReturnType<typeof getOverviewData>;
  selectedPlants: Array<NonNullable<ReturnType<typeof getPlantDetail>>>;
  alerts: ReturnType<typeof getAlerts>;
  grounding: ReturnType<typeof retrieveMockDataContext>;
}

function normalizeScopeQuestion(question: string) {
  return question
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isSystemScopedQuestion(request: QueryRequest) {
  if (request.plantIds?.length) {
    return true;
  }

  const normalized = normalizeScopeQuestion(request.question);

  if (!normalized) {
    return false;
  }

  const matchedPlants = resolvePlantIdsFromQuestion(request.question, request.plantIds);

  if (matchedPlants.length > 0 || normalized.includes("bridgewater")) {
    return true;
  }

  if (HIGH_SIGNAL_SCOPE_TERMS.some((term) => normalized.includes(term))) {
    return true;
  }

  const contextMatches = CONTEXT_SCOPE_TERMS.filter((term) =>
    normalized.includes(term),
  );

  return contextMatches.length >= 2;
}

export function resolveQueryTimeRange(
  question: string,
  requestedTimeRange?: TimeRange,
): TimeRange {
  if (requestedTimeRange) {
    return requestedTimeRange;
  }

  const normalized = question.toLowerCase();

  if (normalized.includes("month to date") || normalized.includes("mtd")) {
    return "month_to_date";
  }

  if (normalized.includes("last 30")) {
    return "last_30_days";
  }

  if (
    normalized.includes("last 7") ||
    normalized.includes("this week") ||
    normalized.includes("past week")
  ) {
    return "last_7_days";
  }

  if (normalized.includes("yesterday")) {
    return "yesterday";
  }

  if (
    normalized.includes("today") ||
    normalized.includes("right now") ||
    normalized.includes("current")
  ) {
    return "today";
  }

  return DEFAULT_QUERY_TIME_RANGE;
}

export function buildOutOfScopeQueryResponse(
  request: QueryRequest,
): QueryResponse {
  const timeRange = resolveQueryTimeRange(request.question, request.timeRange);
  const overview = getOverviewData(timeRange);

  return {
    mode: "fallback",
    answer: {
      question: request.question,
      summary:
        "I can only answer questions grounded in the Bridgewater operations data in this system. I can't help with general knowledge, math, or topics outside the dashboard.",
      insights: [
        "This chat is limited to Bridgewater plant performance, risk ranking, alerts, OTIF, scrap, inventory health, downtime, and trend analysis.",
        `Available plant scope includes ${overview.comparison.map((row) => row.plantName).join(", ")} using MES, ERP, and CMMS data already loaded into the workspace.`,
      ],
      context: {
        timeRange,
        plants: overview.comparison.map((row) => row.plantName),
        sources: ["MES", "ERP", "CMMS"],
      },
      chart: {
        type: "bar",
        title: "Bridgewater facility risk comparison",
        subtitle: "Current operating scope available to the system chat.",
        series: overview.comparison.map((row) => ({
          label: row.plantName,
          value: row.riskIndex,
        })),
      },
      confidence: "high",
      recommendedActions: [
        "Ask about a Bridgewater plant, KPI, alert, ranking, trend, or risk driver.",
        "Examples: Which facility needs attention first, Why is Warren OEE down, What is driving Detroit inventory risk?",
      ],
    },
    grounding: {
      scope: "mock_data",
      strategy: "keyword_rag",
      items: [],
    },
  };
}

export function resolveQueryContext(
  request: QueryRequest,
): QueryContextSnapshot {
  const timeRange = resolveQueryTimeRange(request.question, request.timeRange);
  const overview = getOverviewData(timeRange);
  const matchedPlantIds = resolvePlantIdsFromQuestion(
    request.question,
    request.plantIds,
  );
  const resolvedPlantIds =
    matchedPlantIds.length > 0
      ? matchedPlantIds
      : overview.comparison.map((row) => row.plantId);
  const selectedPlants = resolvedPlantIds
    .map((plantId) => getPlantDetail(plantId, timeRange))
    .filter(
      (
        plant,
      ): plant is NonNullable<ReturnType<typeof getPlantDetail>> => Boolean(plant),
    );

  const alerts = getAlerts().filter((alert) =>
    resolvedPlantIds.includes(alert.plantId),
  );
  const grounding = retrieveMockDataContext({
    ...request,
    question: request.question,
    timeRange,
    plantIds: request.plantIds,
  });

  return {
    question: request.question,
    timeRange,
    plantIds: resolvedPlantIds,
    overview,
    selectedPlants,
    alerts,
    grounding,
  };
}

export function buildFallbackQueryResponse(
  request: QueryRequest,
): QueryResponse {
  if (!isSystemScopedQuestion(request)) {
    return buildOutOfScopeQueryResponse(request);
  }

  const snapshot = resolveQueryContext(request);

  return {
    mode: "fallback",
    answer: answerQuestion(request.question, {
      timeRange: snapshot.timeRange,
      plantIds: snapshot.plantIds,
    }),
    grounding: snapshot.grounding,
  };
}

export function buildModelPayload(request: QueryRequest) {
  const snapshot = resolveQueryContext(request);

  return {
    question: snapshot.question,
    queryScope: request.timeRange ? "requested_time_range" : "overall_network_data",
    timeRange: snapshot.timeRange,
    plantScope: snapshot.plantIds.map((plantId) => ({
      plantId,
      plantName: getPlantById(plantId)?.name ?? plantId,
    })),
    overview: {
      updatedAt: snapshot.overview.updatedAt,
      kpis: snapshot.overview.kpis,
      topRiskPlants: snapshot.overview.comparison.slice(0, 4),
      featuredInsights: snapshot.overview.insights,
      recentTrendWindow: snapshot.overview.trends.slice(-7),
    },
    plants: snapshot.selectedPlants.map((plant) => ({
      plant: plant.plant,
      summary: plant.summary,
      kpis: plant.kpis,
      recentTrendWindow: plant.trends.slice(-7),
      inventorySignals: plant.inventorySignals,
      topAlerts: plant.alerts.slice(0, 3),
    })),
    alerts: snapshot.alerts.slice(0, 6),
    retrievedContext: snapshot.grounding,
  };
}
