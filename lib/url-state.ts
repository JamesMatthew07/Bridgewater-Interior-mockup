import { PLANTS } from "@/lib/mock-data/plants";
import { TIME_RANGE_OPTIONS } from "@/lib/site";
import type { AlertSeverity, MetricKey } from "@/lib/types";
import type { SearchParamValue } from "@/lib/url-state.types";

const VALID_TIME_RANGES = new Set(TIME_RANGE_OPTIONS.map((option) => option.value));
const VALID_ALERT_SEVERITIES = new Set<AlertSeverity>([
  "critical",
  "high",
  "medium",
  "low",
]);
const VALID_METRICS = new Set<MetricKey>([
  "oee",
  "scrapRate",
  "otif",
  "inventoryHealth",
  "downtime",
]);
const VALID_PLANT_IDS = new Set(PLANTS.map((plant) => plant.id));

export type SearchParamsInput = Record<string, SearchParamValue>;

export function getSingleParam(value?: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function coerceTimeRange(value?: SearchParamValue) {
  const normalized = getSingleParam(value);

  if (normalized && VALID_TIME_RANGES.has(normalized as never)) {
    return normalized as (typeof TIME_RANGE_OPTIONS)[number]["value"];
  }

  return "last_7_days";
}

export function coerceAlertSeverity(value?: SearchParamValue) {
  const normalized = getSingleParam(value);

  if (normalized && VALID_ALERT_SEVERITIES.has(normalized as AlertSeverity)) {
    return normalized as AlertSeverity;
  }

  return undefined;
}

export function coerceMetricKey(value?: SearchParamValue) {
  const normalized = getSingleParam(value);

  if (normalized && VALID_METRICS.has(normalized as MetricKey)) {
    return normalized as MetricKey;
  }

  return undefined;
}

export function coercePlantId(value?: SearchParamValue) {
  const normalized = getSingleParam(value);

  if (normalized && VALID_PLANT_IDS.has(normalized)) {
    return normalized;
  }

  return undefined;
}

export function coerceQuestion(value?: SearchParamValue) {
  const normalized = getSingleParam(value)?.trim();
  return normalized ? normalized : undefined;
}

export function buildHref(
  pathname: string,
  current: SearchParamsInput,
  updates: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(current).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) {
          params.append(key, item);
        }
      });
      return;
    }

    if (value) {
      params.set(key, value);
    }
  });

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
      return;
    }

    params.set(key, value);
  });

  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}
