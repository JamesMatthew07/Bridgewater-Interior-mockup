# Delivery Plan

## Delivery Strategy

Build the product in layers so it becomes useful early and stays easy to evolve.

## Suggested Phase Plan

### Phase 1: Foundation

- Create frontend app shell
- Define design direction
- Create mock data model
- Build overview dashboard skeleton
- Stand up basic routing

### Phase 2: KPI Dashboard

- Implement KPI cards
- Implement trend charts
- Implement cross-plant comparison
- Add time filters
- Add plant detail pages

### Phase 3: Alerts

- Add anomaly detection logic
- Build alerts feed and severity model
- Connect alerts into dashboard and plant views

### Phase 4: AI Query Experience

- Add natural-language query UI
- Build query parsing and data fetch flow
- Render answer cards with chart support
- Add source and time-range context

### Phase 5: Polish And Pilot Readiness

- Improve design quality
- Add loading, empty, and error states
- Add test coverage
- Prepare demo scenarios

## MVP Definition

An MVP is ready when:

- the dashboard clearly shows all core KPIs
- all four plants can be compared
- alerts surface meaningful anomalies
- AI query returns grounded answers with charts
- the experience looks credible for a pilot demo

## Recommended Build Order For Codex

1. App scaffold
2. Shared layout and design system basics
3. Mock data and typed models
4. Dashboard page
5. Plant detail page
6. Alerts page
7. Query page
8. AI answer rendering
9. Data-source abstraction for future integrations

## Risks

- Source-system mappings may be inconsistent
- KPI definitions may vary by plant
- "Real-time" expectations may exceed early integration maturity
- AI output quality depends on structured data quality

## Open Questions To Resolve Later

- Actual plant names
- Exact KPI formulas used internally by BWI
- User authentication requirements
- Preferred BI or charting tool constraints
- Real-time ingestion method and refresh interval
- Exporting or scheduled-report requirements

## Definition Of Good Engineering Decisions

Choose solutions that:

- improve clarity
- keep future integration paths open
- avoid locking the app to fake data patterns
- make AI outputs more grounded and explainable

