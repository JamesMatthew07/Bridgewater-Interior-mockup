# Data Foundation

## Source Systems

The platform aggregates data from:

- MES: manufacturing execution data
- ERP: orders, inventory, fulfillment, and business planning data
- CMMS: maintenance events, asset downtime, and work-order context

## Plant Scope

There are four plants in scope. Until real plant names are available, use:

- Plant 1
- Plant 2
- Plant 3
- Plant 4

## Canonical Domain Objects

The application should normalize source data into a clean internal model.

Recommended core entities:

- `Plant`
- `WorkCenter`
- `Asset`
- `ProductionOrder`
- `ProductionSnapshot`
- `DowntimeEvent`
- `ScrapEvent`
- `InventorySnapshot`
- `Shipment`
- `Alert`
- `QuerySession`

## KPI Definitions

### OEE

Overall Equipment Effectiveness.

Recommended formula:

`OEE = Availability x Performance x Quality`

Subcomponents:

- `Availability = Run Time / Planned Production Time`
- `Performance = Ideal Cycle Time x Total Count / Run Time`
- `Quality = Good Count / Total Count`

### Scrap Rate

Recommended formula:

`Scrap Rate = Scrapped Units / Total Produced Units`

### OTIF

On Time In Full.

Recommended formula:

`OTIF = Orders Delivered On Time And In Full / Total Orders`

### Inventory Health

Inventory health is broader than one formula. For MVP, treat it as a composite of:

- on-hand quantity
- days of supply or days on hand
- stockout risk
- overstocks

## Data Grain

The system should support multiple time grains:

- shift
- day
- week
- month

For charts and alerts, daily grain is a good default starting point. Shift-level granularity can be added where data is available.

## Required Dimensions

The model should support filtering and grouping by:

- plant
- time range
- work center
- production line or asset
- product family or SKU when relevant
- order or shipment status

## Freshness Targets

These are good default targets for the pilot:

- KPI dashboard data: near-real-time or frequent refresh
- Alerts: refresh often enough to feel operationally useful
- Historical analysis: daily completeness is acceptable for MVP

If real-time ingestion is not available yet, simulate freshness with timestamped mock updates.

## Data Quality Rules

The system should handle:

- missing values
- late-arriving data
- duplicated events
- inconsistent source naming
- time-zone normalization

The UI should avoid silently presenting uncertain data as fact.

## Example Output Shape

Future API responses should be easy to consume from both charts and AI features.

Example KPI summary shape:

```json
{
  "plantId": "plant-1",
  "timeRange": "last_7_days",
  "kpis": {
    "oee": { "value": 0.78, "changeVsPrior": -0.04 },
    "scrapRate": { "value": 0.036, "changeVsPrior": 0.011 },
    "otif": { "value": 0.91, "changeVsPrior": -0.02 },
    "inventoryHealth": { "value": 0.84, "changeVsPrior": -0.01 }
  },
  "generatedAt": "2026-04-15T10:00:00Z"
}
```

## Modeling Guidance

- Normalize source systems into shared entities before rendering UI.
- Keep raw-source labels available for traceability.
- Store time-series data in a way that supports charting and anomaly detection.
- Separate calculated KPIs from raw events when possible.

