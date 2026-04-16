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

export interface QueryContextSnapshot {
  question: string;
  timeRange: TimeRange;
  plantIds: string[];
  overview: ReturnType<typeof getOverviewData>;
  selectedPlants: Array<NonNullable<ReturnType<typeof getPlantDetail>>>;
  alerts: ReturnType<typeof getAlerts>;
  grounding: ReturnType<typeof retrieveMockDataContext>;
}

export function resolveQueryContext(
  request: QueryRequest,
): QueryContextSnapshot {
  const timeRange = request.timeRange ?? "last_7_days";
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
