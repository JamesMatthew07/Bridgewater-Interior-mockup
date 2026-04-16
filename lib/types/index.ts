export type TimeRange =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "month_to_date";

export type MetricKey =
  | "oee"
  | "scrapRate"
  | "otif"
  | "inventoryHealth"
  | "downtime";

export type MetricUnit = "percent" | "score" | "minutes";
export type DataSource = "MES" | "ERP" | "CMMS";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertStatus = "open" | "watch" | "resolved";
export type ChartType = "line" | "bar" | "area";
export type AiMode = "live" | "fallback";
export type RetrievedContextKind =
  | "network"
  | "insight"
  | "plant"
  | "trend"
  | "alert"
  | "inventory"
  | "downtime";

export interface Plant {
  id: string;
  name: string;
  region: string;
  specialty: string;
  manager: string;
  aliases?: string[];
  shiftStatus: string;
  summary: string;
}

export interface KpiMetric {
  key: MetricKey;
  label: string;
  unit: MetricUnit;
  value: number;
  changeVsPrior: number;
  status: "up" | "down" | "steady";
  narrative: string;
}

export type KpiSummary = Record<MetricKey, KpiMetric>;

export interface TimeSeriesPoint {
  label: string;
  oee: number;
  scrapRate: number;
  otif: number;
  inventoryHealth: number;
  downtime: number;
}

export interface ComparisonRow {
  plantId: string;
  plantName: string;
  headline: string;
  oee: number;
  scrapRate: number;
  otif: number;
  inventoryHealth: number;
  downtime: number;
  activeAlerts: number;
  riskIndex: number;
}

export interface AlertPoint {
  label: string;
  value: number;
  baseline: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  plantId: string;
  plantName: string;
  metric: MetricKey;
  title: string;
  summary: string;
  detectedAt: string;
  changeVsBaseline: number;
  drivers: string[];
  sources: DataSource[];
  chartPoints: AlertPoint[];
}

export interface InsightCard {
  id: string;
  title: string;
  summary: string;
  tone: "positive" | "watch" | "risk";
  plantIds: string[];
  timeRange: TimeRange;
  sources: DataSource[];
  question: string;
  ctaLabel: string;
}

export interface OverviewData {
  updatedAt: string;
  timeRange: TimeRange;
  kpis: KpiSummary;
  comparison: ComparisonRow[];
  trends: TimeSeriesPoint[];
  alerts: Alert[];
  insights: InsightCard[];
}

export interface DowntimeBucket {
  category: string;
  minutes: number;
}

export interface InventorySignal {
  label: string;
  value: number;
  target: number;
  unit: "days" | "%" | "shipments";
  narrative: string;
}

export interface PlantDetailData {
  plant: Plant;
  updatedAt: string;
  timeRange: TimeRange;
  summary: string;
  kpis: KpiSummary;
  trends: TimeSeriesPoint[];
  downtimeMix: DowntimeBucket[];
  inventorySignals: InventorySignal[];
  alerts: Alert[];
  sources: DataSource[];
}

export interface SourceContext {
  timeRange: TimeRange;
  plants: string[];
  sources: DataSource[];
}

export interface SupportingChart {
  type: ChartType;
  title: string;
  subtitle?: string;
  series: Array<{
    label: string;
    value: number;
    baseline?: number;
  }>;
}

export interface AiAnswer {
  question: string;
  summary: string;
  insights: string[];
  context: SourceContext;
  chart: SupportingChart;
  confidence: "high" | "medium" | "low";
  recommendedActions: string[];
}

export interface QueryPreset {
  id: string;
  label: string;
  question: string;
  answer: AiAnswer;
}

export interface QueryRequest {
  question: string;
  timeRange?: TimeRange;
  plantIds?: string[];
}

export interface RetrievedContextItem {
  id: string;
  kind: RetrievedContextKind;
  title: string;
  summary: string;
  plantId?: string;
  plantName?: string;
  metric?: MetricKey;
  severity?: AlertSeverity;
  sources: DataSource[];
}

export interface QueryGrounding {
  scope: "mock_data";
  strategy: "keyword_rag";
  items: RetrievedContextItem[];
}

export interface QueryResponse {
  mode: AiMode;
  answer: AiAnswer;
  grounding: QueryGrounding;
}

export interface AlertFilters {
  plantId?: string;
  severity?: AlertSeverity;
  metric?: MetricKey;
  timeRange?: TimeRange;
}
