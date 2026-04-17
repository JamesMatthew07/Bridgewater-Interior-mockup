import type {
  DowntimeBucket,
  InventorySignal,
  Plant,
  TimeSeriesPoint,
} from "@/lib/types";

type MetricSeriesKey = Exclude<keyof TimeSeriesPoint, "label">;

interface MetricSeriesDefinition {
  checkpoints: Array<[index: number, value: number]>;
  amplitude?: number;
  pattern?: number[];
  min?: number;
  max?: number;
  digits?: number;
}

export const PLANTS: Plant[] = [
  {
    id: "plant-1",
    name: "Oxford / Eastaboga, AL",
    region: "Calhoun County, Alabama",
    specialty: "Honda SUV seating programs",
    manager: "Dezi Hamilton",
    aliases: ["oxford", "eastaboga", "alabama", "oxford eastaboga"],
    shiftStatus: "Sequencing is clean, staffing is balanced, and the line is holding cadence.",
    summary:
      "Oxford / Eastaboga is the benchmark Bridgewater facility this week: healthy OEE, low scrap, and very little alert pressure.",
  },
  {
    id: "plant-2",
    name: "Warren, MI",
    region: "Metro Detroit",
    specialty: "Full-size truck seating programs",
    manager: "Johnny Collins",
    aliases: ["warren", "warren michigan", "truck seat build", "truck seating"],
    shiftStatus: "Recovery focus remains on downtime, scrap, and trim availability.",
    summary:
      "Warren is the main risk facility this week due to sustained downtime growth and worsening quality losses across a high-volume seat build.",
  },
  {
    id: "plant-3",
    name: "Lansing, MI",
    region: "Mid-Michigan",
    specialty: "GM interior systems and outbound sequencing",
    manager: "Sheila James",
    aliases: ["lansing", "lansing michigan", "gm interior systems"],
    shiftStatus: "Production remains strong, but outbound service execution needs watch.",
    summary:
      "Lansing remains the strongest producing facility overall, though OTIF has softened enough to warrant sequencing and outbound attention.",
  },
  {
    id: "plant-4",
    name: "Detroit, MI",
    region: "Detroit headquarters campus",
    specialty: "Seating and interior assembly operations",
    manager: "Erik Hall",
    aliases: ["detroit", "detroit michigan", "hq", "headquarters"],
    shiftStatus: "Throughput is steady, but kit balance and transfer timing remain uneven.",
    summary:
      "Detroit is not in crisis, but inventory imbalance is beginning to erode delivery confidence and planner flexibility.",
  },
];

const SERIES_LENGTH = 60;
const LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const START_DATE = new Date(Date.UTC(2026, 1, 15));

const LABELS = Array.from({ length: SERIES_LENGTH }, (_, index) => {
  const date = new Date(START_DATE);
  date.setUTCDate(START_DATE.getUTCDate() + index);
  return LABEL_FORMATTER.format(date);
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function interpolateValue(
  index: number,
  checkpoints: Array<[index: number, value: number]>,
) {
  if (index <= checkpoints[0][0]) {
    return checkpoints[0][1];
  }

  const lastCheckpoint = checkpoints[checkpoints.length - 1];

  if (index >= lastCheckpoint[0]) {
    return lastCheckpoint[1];
  }

  for (let cursor = 0; cursor < checkpoints.length - 1; cursor += 1) {
    const [startIndex, startValue] = checkpoints[cursor];
    const [endIndex, endValue] = checkpoints[cursor + 1];

    if (index >= startIndex && index <= endIndex) {
      const progress = (index - startIndex) / (endIndex - startIndex);
      return startValue + (endValue - startValue) * progress;
    }
  }

  return lastCheckpoint[1];
}

function buildMetricSeries(
  definition: MetricSeriesDefinition,
  length = SERIES_LENGTH,
) {
  const pattern = definition.pattern ?? [0, 1, -1, 2, -2, 1, 0, -1];
  const amplitude = definition.amplitude ?? 0;
  const digits = definition.digits ?? 3;

  return Array.from({ length }, (_, index) => {
    const base = interpolateValue(index, definition.checkpoints);
    const wiggle = pattern[index % pattern.length] * amplitude;
    const adjusted = clamp(
      base + wiggle,
      definition.min ?? Number.NEGATIVE_INFINITY,
      definition.max ?? Number.POSITIVE_INFINITY,
    );

    return roundTo(adjusted, digits);
  });
}

function buildPlantSeries(
  definitions: Record<MetricSeriesKey, MetricSeriesDefinition>,
) {
  const metricSeries = {
    oee: buildMetricSeries(definitions.oee),
    scrapRate: buildMetricSeries(definitions.scrapRate),
    otif: buildMetricSeries(definitions.otif),
    inventoryHealth: buildMetricSeries(definitions.inventoryHealth),
    downtime: buildMetricSeries(definitions.downtime),
  };

  return LABELS.map((label, index) => ({
    label,
    oee: metricSeries.oee[index],
    scrapRate: metricSeries.scrapRate[index],
    otif: metricSeries.otif[index],
    inventoryHealth: metricSeries.inventoryHealth[index],
    downtime: metricSeries.downtime[index],
  }));
}

const OXFORD_PATTERN = [0, 1, -1, 2, -2, 1, 0, -1, 1, -1];
const WARREN_PATTERN = [0, -1, 1, -2, 2, -1, 1, 0];
const LANSING_PATTERN = [0, 1, 0, -1, 1, 0, -1, 0];
const DETROIT_PATTERN = [0, 2, -1, 1, -2, 1, 0, -1];

export const PLANT_TIME_SERIES: Record<string, TimeSeriesPoint[]> = {
  "plant-1": buildPlantSeries({
    oee: {
      checkpoints: [
        [0, 0.724],
        [8, 0.742],
        [18, 0.77],
        [28, 0.798],
        [40, 0.832],
        [59, 0.858],
      ],
      amplitude: 0.003,
      pattern: OXFORD_PATTERN,
      min: 0.7,
      max: 0.9,
    },
    scrapRate: {
      checkpoints: [
        [0, 0.047],
        [8, 0.045],
        [18, 0.04],
        [28, 0.034],
        [40, 0.029],
        [59, 0.027],
      ],
      amplitude: 0.0005,
      pattern: OXFORD_PATTERN,
      min: 0.024,
      max: 0.055,
    },
    otif: {
      checkpoints: [
        [0, 0.894],
        [18, 0.91],
        [32, 0.934],
        [59, 0.958],
      ],
      amplitude: 0.002,
      pattern: OXFORD_PATTERN,
      min: 0.87,
      max: 0.97,
    },
    inventoryHealth: {
      checkpoints: [
        [0, 0.78],
        [18, 0.82],
        [36, 0.875],
        [59, 0.905],
      ],
      amplitude: 0.002,
      pattern: OXFORD_PATTERN,
      min: 0.75,
      max: 0.93,
    },
    downtime: {
      checkpoints: [
        [0, 124],
        [8, 116],
        [18, 102],
        [28, 88],
        [40, 72],
        [59, 66],
      ],
      amplitude: 1.8,
      pattern: OXFORD_PATTERN,
      min: 58,
      max: 130,
      digits: 0,
    },
  }),
  "plant-2": buildPlantSeries({
    oee: {
      checkpoints: [
        [0, 0.79],
        [15, 0.75],
        [30, 0.71],
        [45, 0.68],
        [59, 0.65],
      ],
      amplitude: 0.003,
      pattern: WARREN_PATTERN,
      min: 0.62,
      max: 0.82,
    },
    scrapRate: {
      checkpoints: [
        [0, 0.039],
        [15, 0.044],
        [30, 0.048],
        [45, 0.053],
        [59, 0.057],
      ],
      amplitude: 0.0007,
      pattern: WARREN_PATTERN,
      min: 0.036,
      max: 0.06,
    },
    otif: {
      checkpoints: [
        [0, 0.92],
        [20, 0.89],
        [40, 0.86],
        [59, 0.84],
      ],
      amplitude: 0.002,
      pattern: WARREN_PATTERN,
      min: 0.82,
      max: 0.93,
    },
    inventoryHealth: {
      checkpoints: [
        [0, 0.84],
        [20, 0.81],
        [40, 0.77],
        [59, 0.74],
      ],
      amplitude: 0.002,
      pattern: WARREN_PATTERN,
      min: 0.72,
      max: 0.86,
    },
    downtime: {
      checkpoints: [
        [0, 96],
        [15, 110],
        [30, 123],
        [45, 136],
        [59, 148],
      ],
      amplitude: 2.2,
      pattern: WARREN_PATTERN,
      min: 90,
      max: 155,
      digits: 0,
    },
  }),
  "plant-3": buildPlantSeries({
    oee: {
      checkpoints: [
        [0, 0.83],
        [20, 0.85],
        [40, 0.87],
        [59, 0.885],
      ],
      amplitude: 0.0025,
      pattern: LANSING_PATTERN,
      min: 0.81,
      max: 0.9,
    },
    scrapRate: {
      checkpoints: [
        [0, 0.031],
        [20, 0.028],
        [40, 0.026],
        [59, 0.025],
      ],
      amplitude: 0.0004,
      pattern: LANSING_PATTERN,
      min: 0.023,
      max: 0.033,
    },
    otif: {
      checkpoints: [
        [0, 0.955],
        [20, 0.948],
        [40, 0.925],
        [59, 0.892],
      ],
      amplitude: 0.0018,
      pattern: LANSING_PATTERN,
      min: 0.885,
      max: 0.96,
    },
    inventoryHealth: {
      checkpoints: [
        [0, 0.87],
        [20, 0.89],
        [40, 0.905],
        [59, 0.915],
      ],
      amplitude: 0.0015,
      pattern: LANSING_PATTERN,
      min: 0.86,
      max: 0.92,
    },
    downtime: {
      checkpoints: [
        [0, 74],
        [20, 68],
        [40, 63],
        [59, 58],
      ],
      amplitude: 1.4,
      pattern: LANSING_PATTERN,
      min: 54,
      max: 78,
      digits: 0,
    },
  }),
  "plant-4": buildPlantSeries({
    oee: {
      checkpoints: [
        [0, 0.825],
        [25, 0.818],
        [40, 0.806],
        [59, 0.798],
      ],
      amplitude: 0.0025,
      pattern: DETROIT_PATTERN,
      min: 0.78,
      max: 0.84,
    },
    scrapRate: {
      checkpoints: [
        [0, 0.034],
        [25, 0.036],
        [40, 0.039],
        [59, 0.041],
      ],
      amplitude: 0.0005,
      pattern: DETROIT_PATTERN,
      min: 0.032,
      max: 0.043,
    },
    otif: {
      checkpoints: [
        [0, 0.95],
        [25, 0.94],
        [40, 0.91],
        [59, 0.888],
      ],
      amplitude: 0.0018,
      pattern: DETROIT_PATTERN,
      min: 0.88,
      max: 0.955,
    },
    inventoryHealth: {
      checkpoints: [
        [0, 0.89],
        [25, 0.86],
        [40, 0.78],
        [59, 0.695],
      ],
      amplitude: 0.002,
      pattern: DETROIT_PATTERN,
      min: 0.68,
      max: 0.9,
    },
    downtime: {
      checkpoints: [
        [0, 78],
        [25, 82],
        [40, 94],
        [59, 102],
      ],
      amplitude: 1.8,
      pattern: DETROIT_PATTERN,
      min: 74,
      max: 106,
      digits: 0,
    },
  }),
};

export const PLANT_DOWNTIME_MIX: Record<string, DowntimeBucket[]> = {
  "plant-1": [
    { category: "Micro Stops", minutes: 118 },
    { category: "Trim Changeover", minutes: 92 },
    { category: "Preventive Maintenance", minutes: 76 },
    { category: "Sequencing Delay", minutes: 52 },
    { category: "Quality Hold", minutes: 38 },
  ],
  "plant-2": [
    { category: "Maintenance", minutes: 231 },
    { category: "Tooling", minutes: 168 },
    { category: "Foam And Trim Delay", minutes: 124 },
    { category: "Changeover", minutes: 112 },
    { category: "Quality Hold", minutes: 97 },
  ],
  "plant-3": [
    { category: "Micro Stops", minutes: 98 },
    { category: "Trailer Staging", minutes: 66 },
    { category: "Packaging Verification", minutes: 58 },
    { category: "Labor Coverage", minutes: 42 },
    { category: "Material Delay", minutes: 39 },
  ],
  "plant-4": [
    { category: "Material Delay", minutes: 146 },
    { category: "Changeover", minutes: 121 },
    { category: "Maintenance", minutes: 103 },
    { category: "Quality Hold", minutes: 74 },
    { category: "Kitting Confirmation", minutes: 61 },
  ],
};

export const PLANT_INVENTORY_SIGNALS: Record<string, InventorySignal[]> = {
  "plant-1": [
    {
      label: "Days Of Supply",
      value: 16,
      target: 14,
      unit: "days",
      narrative: "Seat-kit coverage is comfortable with no immediate JIT stockout pressure.",
    },
    {
      label: "At-Risk Components",
      value: 4,
      target: 6,
      unit: "shipments",
      narrative: "High-risk trim and hardware exposure has stayed below the escalation threshold all week.",
    },
    {
      label: "Planner Confidence",
      value: 88,
      target: 85,
      unit: "%",
      narrative: "Execution confidence remains strong against the current sequencing plan.",
    },
    {
      label: "Supplier Expedites",
      value: 1,
      target: 3,
      unit: "shipments",
      narrative: "Inbound material flow is stable enough that only a single expedite remains open.",
    },
    {
      label: "WIP Balance",
      value: 93,
      target: 88,
      unit: "%",
      narrative: "Work-in-process remains evenly distributed across foam, trim, and final seat assembly cells.",
    },
  ],
  "plant-2": [
    {
      label: "Days Of Supply",
      value: 11,
      target: 14,
      unit: "days",
      narrative: "Coverage is tightening as scrap burns through critical foam and trim inputs.",
    },
    {
      label: "At-Risk Components",
      value: 9,
      target: 6,
      unit: "shipments",
      narrative: "Material churn is starting to affect short-term truck-seat sequencing flexibility.",
    },
    {
      label: "Planner Confidence",
      value: 71,
      target: 85,
      unit: "%",
      narrative: "The build plan is becoming less reliable shift to shift.",
    },
    {
      label: "Supplier Expedites",
      value: 7,
      target: 3,
      unit: "shipments",
      narrative: "Expedite requests are climbing as unstable yield burns through critical trim inputs.",
    },
    {
      label: "WIP Balance",
      value: 68,
      target: 88,
      unit: "%",
      narrative: "Work-in-process is pooling around rework loops and seat hold points instead of flowing cleanly.",
    },
  ],
  "plant-3": [
    {
      label: "Days Of Supply",
      value: 15,
      target: 14,
      unit: "days",
      narrative: "Supply depth is healthy, but outbound sequencing to customer release is softening.",
    },
    {
      label: "At-Risk Components",
      value: 5,
      target: 6,
      unit: "shipments",
      narrative: "Material exposure is moderate and still manageable.",
    },
    {
      label: "Planner Confidence",
      value: 82,
      target: 85,
      unit: "%",
      narrative: "Service risk is more about launch and outbound execution than raw inventory shortfall.",
    },
    {
      label: "Trailer Readiness",
      value: 6,
      target: 4,
      unit: "shipments",
      narrative: "Too many finished interior sets are waiting for trailers and final packaging release at the same time.",
    },
    {
      label: "Finished Goods Staging",
      value: 76,
      target: 88,
      unit: "%",
      narrative: "Finished goods are building faster than the staging lane can clear, which is pressuring OTIF.",
    },
  ],
  "plant-4": [
    {
      label: "Days Of Supply",
      value: 19,
      target: 14,
      unit: "days",
      narrative: "Coverage looks high overall, but it is poorly distributed across key seat and interior kit families.",
    },
    {
      label: "At-Risk Components",
      value: 8,
      target: 6,
      unit: "shipments",
      narrative: "Stock sits in the wrong places, creating localized kit shortages.",
    },
    {
      label: "Planner Confidence",
      value: 74,
      target: 85,
      unit: "%",
      narrative: "Inventory imbalance is reducing confidence in the next two Detroit shifts.",
    },
    {
      label: "Transfer Requests",
      value: 10,
      target: 5,
      unit: "shipments",
      narrative: "Inter-plant transfer requests are stacking up because the right kits are not in the right cells.",
    },
    {
      label: "Kitting Accuracy",
      value: 72,
      target: 88,
      unit: "%",
      narrative: "Kit substitutions and partial kits are increasing line-side disruption during final assembly.",
    },
  ],
};
