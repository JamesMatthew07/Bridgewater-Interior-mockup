import { MOCK_ALERTS } from "@/lib/mock-data/alerts";
import {
  PLANTS,
  PLANT_DOWNTIME_MIX,
  PLANT_INVENTORY_SIGNALS,
  PLANT_TIME_SERIES,
} from "@/lib/mock-data/plants";
import { QUERY_PRESETS } from "@/lib/mock-data/query-responses";
import { formatMetricValue, severityLabel } from "@/lib/format";
import { METRIC_META } from "@/lib/site";
import type {
  AiAnswer,
  AlertFilters,
  Alert,
  ComparisonRow,
  InsightCard,
  KpiMetric,
  KpiSummary,
  MetricKey,
  Plant,
  PlantDetailData,
  QueryPreset,
  TimeRange,
  TimeSeriesPoint,
  OverviewData,
} from "@/lib/types";

const GENERATED_AT = "2026-04-15T10:00:00Z";

function getPlantName(plantId: string, fallback: string) {
  return PLANTS.find((plant) => plant.id === plantId)?.name ?? fallback;
}

const OXFORD = getPlantName("plant-1", "Oxford / Eastaboga, AL");
const WARREN = getPlantName("plant-2", "Warren, MI");
const LANSING = getPlantName("plant-3", "Lansing, MI");
const DETROIT = getPlantName("plant-4", "Detroit, MI");

const RANGE_WINDOWS: Record<TimeRange, number> = {
  today: 1,
  yesterday: 1,
  last_7_days: 7,
  last_30_days: 30,
  month_to_date: 15,
};

const OVERVIEW_INSIGHTS: InsightCard[] = [
  {
    id: "network-risk",
    title: `${WARREN} is driving the network risk profile`,
    summary:
      `The network story is still defined by ${WARREN} quality and downtime pressure. Without containment there, Bridgewater-wide OEE and planner confidence will continue to drift.`,
    tone: "risk",
    plantIds: ["plant-2"],
    timeRange: "today",
    sources: ["MES", "CMMS", "ERP"],
    question: "Which Bridgewater facility needs attention first today?",
    ctaLabel: "Open the priority analysis",
  },
  {
    id: "plant-3-watch",
    title: `${LANSING} remains strong, but service execution is softening`,
    summary:
      `${LANSING} keeps the best OEE in the group, yet its OTIF slippage suggests the next bottleneck is in outbound flow rather than line performance.`,
    tone: "watch",
    plantIds: ["plant-3"],
    timeRange: "last_7_days",
    sources: ["MES", "ERP"],
    question: "Which Bridgewater orders are most at risk of missing OTIF targets?",
    ctaLabel: "Ask about OTIF risk",
  },
  {
    id: "plant-1-positive",
    title: `${OXFORD} is the current benchmark facility`,
    summary:
      `${OXFORD} is quietly improving across OEE, scrap, and inventory stability, making it the best operational benchmark for the rest of the network.`,
    tone: "positive",
    plantIds: ["plant-1"],
    timeRange: "last_7_days",
    sources: ["MES", "ERP"],
    question: "What changed most since yesterday at Oxford / Eastaboga?",
    ctaLabel: "Inspect the benchmark plant",
  },
  {
    id: "plant-4-inventory-watch",
    title: `${DETROIT} inventory imbalance is turning into a planning problem`,
    summary:
      `${DETROIT} has enough total stock, but transfer friction and kitting instability are creating localized shortages that will keep pressuring service if left alone.`,
    tone: "watch",
    plantIds: ["plant-4"],
    timeRange: "last_7_days",
    sources: ["ERP", "MES"],
    question: "Why is inventory health weakening in Detroit?",
    ctaLabel: "Inspect Detroit inventory risk",
  },
  {
    id: "plant-2-material-risk",
    title: `${WARREN} now has a secondary material-risk storyline`,
    summary:
      `${WARREN} remains the headline downtime and scrap issue, but material coverage is starting to deteriorate as unstable yield burns through critical trim inputs.`,
    tone: "risk",
    plantIds: ["plant-2"],
    timeRange: "today",
    sources: ["ERP", "MES", "CMMS"],
    question: "Which losses are driving Warren attention today?",
    ctaLabel: "Break down the Warren losses",
  },
];

const PLANT_QUESTIONS: Record<string, string[]> = {
  "plant-1": [
    "What changed most since yesterday at Oxford / Eastaboga?",
    "Why is Oxford / Eastaboga the current benchmark facility?",
    "Show Oxford / Eastaboga OEE and scrap over the last 7 days.",
    "Are any service risks emerging at Oxford / Eastaboga?",
  ],
  "plant-2": [
    "Why did Warren OEE drop yesterday?",
    "Which losses are driving Warren attention today?",
    "Show Warren downtime and scrap over the last 7 days.",
    "What is happening with Warren material coverage?",
  ],
  "plant-3": [
    "Why is Lansing OTIF softer even with strong OEE?",
    "Which Bridgewater orders are most at risk of missing OTIF targets?",
    "Show Lansing service and downtime trends over the last 30 days.",
    "Are packaging delays starting to affect Lansing?",
  ],
  "plant-4": [
    "Show downtime trend for Detroit over the last 30 days.",
    "Why is inventory health weakening in Detroit?",
    "Which Bridgewater facility has the highest inventory risk right now?",
    "What is driving Detroit changeover drag?",
  ],
};

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getWindow(points: TimeSeriesPoint[], timeRange: TimeRange) {
  const window = RANGE_WINDOWS[timeRange];

  if (timeRange === "yesterday") {
    return points.slice(-2, -1);
  }

  return points.slice(-window);
}

function getPreviousWindow(points: TimeSeriesPoint[], timeRange: TimeRange) {
  const window = RANGE_WINDOWS[timeRange];

  if (timeRange === "today") {
    return points.slice(-2, -1);
  }

  if (timeRange === "yesterday") {
    return points.slice(-3, -2);
  }

  const start = Math.max(0, points.length - window * 2);
  const end = Math.max(0, points.length - window);
  const previous = points.slice(start, end);

  if (previous.length > 0) {
    return previous;
  }

  return points.slice(0, window);
}

function metricAverage(points: TimeSeriesPoint[], metric: MetricKey) {
  return average(points.map((point) => point[metric]));
}

function buildMetric(metric: MetricKey, value: number, changeVsPrior: number): KpiMetric {
  const direction =
    changeVsPrior === 0 ? "steady" : changeVsPrior > 0 ? "up" : "down";

  const narrativeMap: Record<MetricKey, string> = {
    oee:
      changeVsPrior >= 0
        ? "Throughput resilience is holding against the prior window."
        : "Availability and quality pressure are dragging efficiency lower.",
    scrapRate:
      changeVsPrior <= 0
        ? "Quality losses are contained better than the prior window."
        : "Yield loss is expanding faster than the recent baseline.",
    otif:
      changeVsPrior >= 0
        ? "Service execution is stable to improving."
        : "Delivery reliability is softer than the prior window.",
    inventoryHealth:
      changeVsPrior >= 0
        ? "Material coverage is supporting the current plan."
        : "Inventory imbalance is increasing planner risk.",
    downtime:
      changeVsPrior <= 0
        ? "Line interruptions are improving versus the prior window."
        : "Downtime drag is rising and needs attention.",
  };

  return {
    key: metric,
    label: METRIC_META[metric].shortLabel,
    unit: METRIC_META[metric].unit,
    value: round(value),
    changeVsPrior: round(changeVsPrior),
    status: direction,
    narrative: narrativeMap[metric],
  };
}

function buildKpiSummary(
  points: TimeSeriesPoint[],
  previousPoints: TimeSeriesPoint[],
): KpiSummary {
  const metrics: MetricKey[] = [
    "oee",
    "scrapRate",
    "otif",
    "inventoryHealth",
    "downtime",
  ];

  return metrics.reduce((summary, metric) => {
    const current = metricAverage(points, metric);
    const previous = metricAverage(previousPoints, metric);
    summary[metric] = buildMetric(metric, current, current - previous);
    return summary;
  }, {} as KpiSummary);
}

function aggregateOverviewTrend(timeRange: TimeRange) {
  const plantSeries = PLANTS.map((plant) =>
    getWindow(PLANT_TIME_SERIES[plant.id], timeRange),
  );
  const length = Math.min(...plantSeries.map((series) => series.length));

  return Array.from({ length }, (_, index) => {
    const points = plantSeries.map((series) => series[index]);
    return {
      label: points[0].label,
      oee: round(average(points.map((point) => point.oee))),
      scrapRate: round(average(points.map((point) => point.scrapRate))),
      otif: round(average(points.map((point) => point.otif))),
      inventoryHealth: round(
        average(points.map((point) => point.inventoryHealth)),
      ),
      downtime: round(average(points.map((point) => point.downtime))),
    };
  });
}

function getActiveAlertsForPlant(plantId: string) {
  return MOCK_ALERTS.filter(
    (alert) => alert.plantId === plantId && alert.status !== "resolved",
  );
}

function buildComparisonRow(plant: Plant, timeRange: TimeRange): ComparisonRow {
  const current = getWindow(PLANT_TIME_SERIES[plant.id], timeRange);
  const summary = buildKpiSummary(
    current,
    getPreviousWindow(PLANT_TIME_SERIES[plant.id], timeRange),
  );
  const alerts = getActiveAlertsForPlant(plant.id);
  const severityWeight = alerts.reduce((total, alert) => {
    const weightMap = { critical: 24, high: 16, medium: 9, low: 4 };
    return total + weightMap[alert.severity];
  }, 0);

  const oeePenalty = clamp((0.9 - summary.oee.value) / 0.22);
  const scrapPenalty = clamp((summary.scrapRate.value - 0.024) / 0.036);
  const otifPenalty = clamp((0.97 - summary.otif.value) / 0.11);
  const inventoryPenalty = clamp((0.9 - summary.inventoryHealth.value) / 0.22);
  const downtimePenalty = clamp((summary.downtime.value - 60) / 90);
  const alertPenalty = clamp(severityWeight / 45);

  const riskIndex = Math.round(
    (
      oeePenalty * 0.24 +
      scrapPenalty * 0.22 +
      otifPenalty * 0.18 +
      inventoryPenalty * 0.18 +
      downtimePenalty * 0.12 +
      alertPenalty * 0.06
    ) * 100,
  );

  return {
    plantId: plant.id,
    plantName: plant.name,
    headline: plant.summary,
    oee: summary.oee.value,
    scrapRate: summary.scrapRate.value,
    otif: summary.otif.value,
    inventoryHealth: summary.inventoryHealth.value,
    downtime: summary.downtime.value,
    activeAlerts: alerts.length,
    riskIndex,
  };
}

export function getPlants() {
  return PLANTS;
}

export function getPlantById(plantId: string) {
  return PLANTS.find((plant) => plant.id === plantId);
}

export function getOverviewData(timeRange: TimeRange = "last_7_days"): OverviewData {
  const overviewTrend = aggregateOverviewTrend(timeRange);
  const previousTrend = aggregateOverviewTrend(
    timeRange === "today" ? "yesterday" : "last_7_days",
  );

  return {
    updatedAt: GENERATED_AT,
    timeRange,
    kpis: buildKpiSummary(overviewTrend, previousTrend),
    comparison: PLANTS.map((plant) => buildComparisonRow(plant, timeRange)).sort(
      (left, right) => right.riskIndex - left.riskIndex,
    ),
    trends: overviewTrend,
    alerts: getAlerts(),
    insights: OVERVIEW_INSIGHTS,
  };
}

export function getPlantDetail(
  plantId: string,
  timeRange: TimeRange = "last_7_days",
): PlantDetailData | null {
  const plant = getPlantById(plantId);

  if (!plant) {
    return null;
  }

  const points = getWindow(PLANT_TIME_SERIES[plantId], timeRange);
  const previous = getPreviousWindow(PLANT_TIME_SERIES[plantId], timeRange);

  return {
    plant,
    updatedAt: GENERATED_AT,
    timeRange,
    summary: plant.summary,
    kpis: buildKpiSummary(points, previous),
    trends: points,
    downtimeMix: PLANT_DOWNTIME_MIX[plantId],
    inventorySignals: PLANT_INVENTORY_SIGNALS[plantId],
    alerts: getAlerts({ plantId, timeRange }),
    sources: ["MES", "ERP", "CMMS"],
  };
}

export function getAlerts(filters: AlertFilters = {}): Alert[] {
  const filtered = MOCK_ALERTS.filter((alert) => {
    if (filters.plantId && alert.plantId !== filters.plantId) {
      return false;
    }

    if (filters.severity && alert.severity !== filters.severity) {
      return false;
    }

    if (filters.metric && alert.metric !== filters.metric) {
      return false;
    }

    return true;
  });

  const severityRank = { critical: 0, high: 1, medium: 2, low: 3 };

  return [...filtered].sort((left, right) => {
    if (severityRank[left.severity] !== severityRank[right.severity]) {
      return severityRank[left.severity] - severityRank[right.severity];
    }

    return (
      new Date(right.detectedAt).getTime() - new Date(left.detectedAt).getTime()
    );
  });
}

export function getSeveritySummary(filters: AlertFilters = {}) {
  return getAlerts(filters).reduce(
    (summary, alert) => {
      summary[alert.severity] += 1;
      return summary;
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  );
}

export function getQueryPresets(): QueryPreset[] {
  return QUERY_PRESETS;
}

export function getPlantQuestions(plantId: string) {
  return PLANT_QUESTIONS[plantId] ?? [];
}

export function resolvePlantIdsFromQuestion(
  question: string,
  explicitPlantIds?: string[],
) {
  if (explicitPlantIds?.length) {
    return explicitPlantIds.filter((plantId) =>
      PLANTS.some((plant) => plant.id === plantId),
    );
  }

  const normalized = normalizeQuestion(question);
  const matchedPlants = PLANTS.filter((plant) => {
    const searchTerms = [
      plant.name,
      plant.region,
      plant.specialty,
      plant.id.replace("-", " "),
      ...(plant.aliases ?? []),
    ]
      .map((term) => normalizeQuestion(term))
      .filter(Boolean);

    return searchTerms.some((term) => normalized.includes(term));
  }).map((plant) => plant.id);

  return matchedPlants;
}

function normalizeQuestion(question: string) {
  return question
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ");
}

function mentionsPlant(normalized: string, plantId: string) {
  const plant = getPlantById(plantId);

  if (!plant) {
    return false;
  }

  return [plant.name, plant.id.replace("-", " "), ...(plant.aliases ?? [])]
    .map((value) => normalizeQuestion(value))
    .some((value) => normalized.includes(value));
}

function matchesPresetIntent(normalized: string, presetId: string) {
  switch (presetId) {
    case "attention-first":
      return (
        (
          normalized.includes("attention") ||
          normalized.includes("most risk") ||
          normalized.includes("highest risk") ||
          normalized.includes("top risk") ||
          normalized.includes("needs attention") ||
          (normalized.includes("risk") && normalized.includes("right now"))
        ) &&
        !mentionsPlant(normalized, "plant-2")
      );
    case "plant-2-oee":
      return mentionsPlant(normalized, "plant-2") && normalized.includes("oee");
    case "plant-2-loss-drivers":
      return mentionsPlant(normalized, "plant-2") && (
        normalized.includes("attention") ||
        normalized.includes("losses") ||
        normalized.includes("coverage")
      );
    case "plant-3-otif-soft":
      return mentionsPlant(normalized, "plant-3") && (
        normalized.includes("otif") || normalized.includes("packaging")
      );
    case "plant-1-benchmark":
      return normalized.includes("benchmark") || (
        mentionsPlant(normalized, "plant-1") && (
          normalized.includes("benchmark") ||
          normalized.includes("service") ||
          normalized.includes("oee")
        )
      );
    case "inventory-risk":
      return normalized.includes("inventory risk");
    case "plant-4-inventory":
      return mentionsPlant(normalized, "plant-4") && normalized.includes("inventory");
    case "worst-scrap":
      return normalized.includes("scrap");
    case "plant-4-downtime":
      return mentionsPlant(normalized, "plant-4") && (
        normalized.includes("downtime") || normalized.includes("changeover")
      );
    case "otif-risk":
      return normalized.includes("otif") || normalized.includes("orders");
    default:
      return false;
  }
}

function buildPlantFallbackAnswer(
  question: string,
  plantId: string,
  timeRange: TimeRange,
): AiAnswer | null {
  const detail = getPlantDetail(plantId, timeRange);

  if (!detail) {
    return null;
  }

  const firstTrend = detail.trends[0];
  const lastTrend = detail.trends.at(-1) ?? firstTrend;
  const topAlert = detail.alerts[0];
  const topInventorySignal = detail.inventorySignals[0];
  const topDowntimeBucket = [...detail.downtimeMix].sort(
    (left, right) => right.minutes - left.minutes,
  )[0];

  return {
    question,
    summary: `${detail.plant.name} is currently running at OEE ${formatMetricValue("oee", detail.kpis.oee.value)}, scrap ${formatMetricValue("scrapRate", detail.kpis.scrapRate.value)}, OTIF ${formatMetricValue("otif", detail.kpis.otif.value)}, inventory health ${formatMetricValue("inventoryHealth", detail.kpis.inventoryHealth.value)}, and downtime ${formatMetricValue("downtime", detail.kpis.downtime.value)}. ${topAlert ? `${topAlert.title} is the highest-priority active issue at the site.` : `${detail.plant.name} does not have a dominating active alert, but it still needs watch on its weakest operating signals.`}`,
    insights: [
      `${detail.plant.name} moved from OEE ${formatMetricValue("oee", firstTrend.oee)} to ${formatMetricValue("oee", lastTrend.oee)} while downtime moved from ${formatMetricValue("downtime", firstTrend.downtime)} to ${formatMetricValue("downtime", lastTrend.downtime)} across the current operating view.`,
      topAlert
        ? `${severityLabel(topAlert.severity)} alert: ${topAlert.summary} Primary drivers are ${topAlert.drivers.join(", ")}.`
        : `${topInventorySignal.label} is at ${topInventorySignal.value}${topInventorySignal.unit === "%" ? "%" : ""} against a target of ${topInventorySignal.target}${topInventorySignal.unit === "%" ? "%" : ""}, and ${topInventorySignal.narrative.toLowerCase()}`,
      `${topDowntimeBucket.category} is the largest downtime bucket at ${detail.plant.name} with ${topDowntimeBucket.minutes} minutes, which helps explain why ${detail.kpis.downtime.narrative.toLowerCase()}`,
    ],
    context: {
      timeRange,
      plants: [detail.plant.name],
      sources: detail.sources,
    },
    chart: {
      type: "line",
      title: `${detail.plant.name} operating trend`,
      subtitle: "Value tracks OEE while the baseline tracks downtime minutes.",
      series: detail.trends.slice(-Math.min(7, detail.trends.length)).map((point) => ({
        label: point.label,
        value: point.oee,
        baseline: Math.round(point.downtime),
      })),
    },
    confidence: topAlert ? "high" : "medium",
    recommendedActions: topAlert
      ? [
          `Contain ${detail.plant.name}'s highest-loss issue by addressing ${topAlert.drivers.slice(0, 2).join(" and ")} first.`,
          `Keep daily review on ${detail.plant.name} inventory balance and downtime so the current alert does not expand into service risk.`,
        ]
      : [
          `Keep ${detail.plant.name} focused on ${topInventorySignal.label.toLowerCase()} and ${topDowntimeBucket.category.toLowerCase()} so the site does not drift into a new alert cycle.`,
        ],
  };
}

function buildNetworkFallbackAnswer(
  question: string,
  plantIds: string[],
  timeRange: TimeRange,
): AiAnswer {
  const overview = getOverviewData(timeRange);
  const scopedComparison =
    plantIds.length > 0
      ? overview.comparison.filter((row) => plantIds.includes(row.plantId))
      : overview.comparison;
  const comparison = scopedComparison.length > 0 ? scopedComparison : overview.comparison;
  const comparisonByOee = [...comparison].sort((left, right) => right.oee - left.oee);
  const comparisonByOtif = [...comparison].sort((left, right) => left.otif - right.otif);
  const comparisonByInventory = [...comparison].sort(
    (left, right) => left.inventoryHealth - right.inventoryHealth,
  );
  const comparisonByScrap = [...comparison].sort(
    (left, right) => right.scrapRate - left.scrapRate,
  );
  const topRisk = comparison[0];
  const benchmarkPlant = comparisonByOee[0];
  const serviceWatchPlant = comparisonByOtif[0];
  const inventoryWatchPlant = comparisonByInventory[0];
  const scrapWatchPlant = comparisonByScrap[0];
  const scopedAlerts = getAlerts().filter(
    (alert) => plantIds.length === 0 || plantIds.includes(alert.plantId),
  );
  const topAlerts = scopedAlerts.slice(0, 2);

  return {
    question,
    summary: `${topRisk.plantName} is carrying the most operational pressure in the Bridgewater network at a risk index of ${topRisk.riskIndex}, with OEE ${formatMetricValue("oee", topRisk.oee)}, scrap ${formatMetricValue("scrapRate", topRisk.scrapRate)}, and ${topRisk.activeAlerts} active alerts. ${benchmarkPlant.plantName} remains the benchmark facility, while ${inventoryWatchPlant.plantName} is the main inventory watch.`,
    insights: [
      `${scrapWatchPlant.plantName} has the heaviest scrap exposure at ${formatMetricValue("scrapRate", scrapWatchPlant.scrapRate)}, while ${benchmarkPlant.plantName} is leading network OEE at ${formatMetricValue("oee", benchmarkPlant.oee)}.`,
      `${serviceWatchPlant.plantName} has the softest OTIF at ${formatMetricValue("otif", serviceWatchPlant.otif)}, which keeps service execution risk on watch even when line output is stronger elsewhere.`,
      topAlerts.length > 0
        ? `The most urgent active alerts are ${topAlerts.map((alert) => `${alert.plantName}: ${alert.title}`).join(" and ")}.`
        : "The network does not have a single dominant alert cluster right now, so the watch should stay on cross-facility trend drift.",
    ],
    context: {
      timeRange,
      plants: comparison.map((row) => row.plantName),
      sources: ["MES", "ERP", "CMMS"],
    },
    chart: {
      type: "bar",
      title: "Bridgewater facility risk comparison",
      subtitle: "Higher score indicates more operational attention required.",
      series: comparison.map((row) => ({
        label: row.plantName,
        value: row.riskIndex,
      })),
    },
    confidence: topAlerts.some((alert) => alert.severity === "critical") ? "high" : "medium",
    recommendedActions: [
      `Stabilize ${topRisk.plantName} first by attacking its highest-loss downtime and scrap drivers before the next shift transition.`,
      inventoryWatchPlant.plantId !== topRisk.plantId
        ? `Rebalance material coverage and transfer flow in ${inventoryWatchPlant.plantName} so inventory friction does not become the next service miss driver.`
        : `Keep material coverage, scrap containment, and planner recovery tightly linked at ${topRisk.plantName}.`,
    ],
  };
}

export function answerQuestion(
  question: string,
  options?: { timeRange?: TimeRange; plantIds?: string[] },
): AiAnswer {
  const normalized = normalizeQuestion(question);
  const resolvedPlantIds = resolvePlantIdsFromQuestion(question, options?.plantIds);
  const preset =
    QUERY_PRESETS.find((item) => normalizeQuestion(item.question) === normalized) ??
    QUERY_PRESETS.find((item) => matchesPresetIntent(normalized, item.id));

  if (preset) {
    return {
      ...preset.answer,
      context: {
        ...preset.answer.context,
        timeRange: options?.timeRange ?? preset.answer.context.timeRange,
        plants:
          resolvedPlantIds.length > 0
            ? resolvedPlantIds
                .map((plantId) => getPlantById(plantId)?.name)
                .filter((plantName): plantName is string => Boolean(plantName))
            : preset.answer.context.plants,
      },
    };
  }

  const fallbackPlantIds =
    resolvedPlantIds.length > 0
      ? resolvedPlantIds
      : PLANTS.map((plant) => plant.id);
  const fallbackTimeRange = options?.timeRange ?? "last_30_days";
  const plantFallback =
    fallbackPlantIds.length === 1
      ? buildPlantFallbackAnswer(question, fallbackPlantIds[0], fallbackTimeRange)
      : null;

  if (plantFallback) {
    return plantFallback;
  }

  return buildNetworkFallbackAnswer(question, fallbackPlantIds, fallbackTimeRange);
}
