# Product Requirements

## Product Goal

Give BWI managers one place to monitor plant performance, detect emerging issues, and ask data questions in natural language.

## MVP Scope

The MVP should include these feature areas:

1. Executive dashboard
2. Cross-plant KPI comparison
3. Plant detail views
4. Anomaly alerts
5. Natural-language query interface
6. AI answer cards with supporting charts and source context

## Core Functional Requirements

### 1. Executive Dashboard

The main dashboard should show:

- top-line KPI cards for OEE, scrap rate, OTIF, and inventory health
- KPI trend charts over time
- current alert count and severity
- a cross-plant comparison summary
- recent AI insights or notable changes

### 2. Cross-Plant Comparison

Users should be able to compare all four plants by:

- current KPI values
- change versus prior period
- rank order
- trend direction
- active alert count

### 3. Plant Detail View

Each plant page should show:

- KPI breakdowns
- production and downtime trends
- scrap behavior
- inventory position
- recent alerts
- AI-generated plain-language summary for that plant

### 4. Anomaly Alerts

The system should detect and surface:

- unusual scrap spikes
- unexpected downtime increases
- worsening OTIF risk
- abnormal inventory patterns

Each alert should include:

- severity
- affected plant
- affected metric
- detection timestamp
- likely drivers if available
- supporting chart or trend snippet

### 5. Natural-Language Query Interface

Users should be able to ask questions like:

- Why did Plant 2 OEE drop yesterday?
- Which plant has the highest scrap trend this week?
- Show downtime trend for Plant 4 over the last 30 days.
- Which orders are most at risk of missing OTIF targets?

The system should return:

- a concise answer
- supporting insights
- one or more charts when useful
- source and time-range context

### 6. Time Filtering

Users should be able to filter by common operational time windows:

- current shift
- today
- yesterday
- last 7 days
- last 30 days
- month to date
- custom range

## User Stories

- As a plant manager, I want to see my plant's KPI status at a glance so I can act quickly.
- As an operations leader, I want to compare plants side by side so I can prioritize support.
- As a manufacturing engineer, I want to detect scrap or downtime anomalies early so I can investigate before the issue grows.
- As a manager, I want to ask questions in plain language so I do not need to wait for manual reports.
- As an executive, I want concise summaries with charts so I can understand risk quickly.

## In Scope

- Dashboard UI
- KPI cards and trend visualizations
- Alert feed
- Plant comparison
- Query input and AI answer rendering
- Mockable data layer with clear upgrade path to real integrations

## Out Of Scope For Initial MVP

- Full workflow automation across plants
- Control-system writeback or machine control
- Highly customized per-plant business logic
- Mobile-native app
- Complex role-based approval workflows

## UX Requirements

- The experience must feel fast, clear, and executive-friendly.
- Users should understand system status within the first 10 seconds of landing on the dashboard.
- AI responses should feel trustworthy, not magical.
- Charts should support the answer instead of overwhelming it.

## MVP Acceptance Criteria

- A user can view all key KPIs across all four plants in one dashboard.
- A user can drill into a single plant and inspect trends.
- A user can see alerting for abnormal operational behavior.
- A user can ask a question in natural language and get a grounded answer with a chart.
- The UI and data model are structured so real source-system integrations can replace mock data later without major rewrites.

