# System Architecture

## Architecture Goal

Build a modular analytics application that can start with realistic mock data, then evolve into a production system backed by MES, ERP, and CMMS integrations.

## High-Level Architecture

Recommended logical layers:

1. Data ingestion layer
2. Normalization and metrics layer
3. Application API layer
4. AI orchestration layer
5. Frontend dashboard layer

## Proposed Technical Direction

This is a recommended default, not a locked requirement:

- Frontend: `Next.js` with App Router
- UI: React components plus a charting library such as `Recharts` or `ECharts`
- Backend API: route handlers in Next.js or a separate lightweight API service
- Database: `PostgreSQL` with time-series-friendly modeling
- Cache or queue: add later if real-time ingestion requires it
- AI provider: API-driven LLM integration for query interpretation and response generation

## Why This Direction Makes Sense

- Fast to prototype
- Easy to demo
- Good support for charts, dashboards, and AI-assisted UI
- Clean path from mock data to real APIs
- Manageable complexity for an MVP

## Recommended Frontend Structure

Suggested route areas:

- `/`
- `/plants/[plantId]`
- `/alerts`
- `/query`

Suggested UI modules:

- KPI cards
- trend charts
- cross-plant comparison table
- alert feed
- AI query panel
- AI answer card

## Recommended Backend Capabilities

The backend should provide:

- KPI aggregation endpoints
- plant detail endpoints
- alert list endpoints
- time-series endpoints
- AI query endpoint

Example endpoint ideas:

- `GET /api/overview`
- `GET /api/plants/:id`
- `GET /api/plants/:id/timeseries`
- `GET /api/alerts`
- `POST /api/query`

## Data Flow

Recommended flow:

1. Source-system data is ingested or mocked.
2. Raw data is normalized into shared entities.
3. KPI calculations are generated from normalized data.
4. Alerts are derived from KPI and event patterns.
5. Frontend reads API responses for dashboard views.
6. AI query flow reads filtered metrics and returns structured answers with chart guidance.

## AI Query Processing Pattern

The AI layer should not query raw text blindly. A better pattern is:

1. Interpret the user's question
2. Resolve the intended metric, plants, and time range
3. Fetch the structured data needed
4. Generate an answer from that data
5. Return both narrative and visualization metadata

This keeps the system grounded and easier to trust.

## Non-Functional Requirements

- Fast perceived performance
- Clean, executive-ready design
- Clear loading and empty states
- Traceable AI answers
- Easy ability to swap mock data for real integrations

## Engineering Guidance

- Start simple and modular.
- Avoid over-engineering microservices too early.
- Keep the data contracts explicit.
- Prefer typed, well-defined response shapes.
- Design components so charts and AI answers can evolve independently.

