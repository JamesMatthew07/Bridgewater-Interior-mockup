# Mockup Data Strategy

## Goal

Use dummy data that feels realistic enough to power a convincing manufacturing analytics demo.

## Core Rule

The mockup should use **dummy data only**, but that data should behave like real operations data.

## Dummy Data Principles

The data should be:

- internally consistent
- trend-based, not random noise
- slightly imperfect, like real reporting data
- rich enough to support KPI views, alerts, and AI explanations

## Recommended Mock Entities

Create mock datasets for:

- plants
- KPI summaries
- KPI time series
- downtime events
- scrap events
- inventory snapshots
- shipments or OTIF snapshots
- alerts
- AI query responses or query-ready facts

## Recommended Storylines

The dummy data should tell believable stories such as:

- one plant has worsening scrap this week
- another plant has elevated downtime tied to maintenance issues
- one plant is strongest overall but showing early OTIF risk
- inventory looks stable in most plants but risky in one area

These storylines make the dashboard and AI output feel intentional instead of random.

## Time Windows

The mock data should support:

- today
- yesterday
- last 7 days
- last 30 days
- month to date

Daily data is enough for the initial mockup. Add shift-level data only if it improves the demo.

## Recommended Storage Pattern

If code is scaffolded later, a strong default would be:

```text
lib/mock-data/plants.ts
lib/mock-data/overview.ts
lib/mock-data/timeseries.ts
lib/mock-data/alerts.ts
lib/mock-data/query-responses.ts
lib/types/
```

## Typed Data Rule

Even though the data is fake, it should still be typed.

Future Codex sessions should define clear types for:

- KPI values
- chart series
- alerts
- AI answers
- filter state

## Mock API Rule

There are two acceptable patterns for the mockup:

1. components read mock data directly from local modules
2. route handlers return mock data to mimic real APIs

Pattern 2 is slightly better if we want an easier upgrade path later.

## AI Query Strategy

For the mockup, the AI experience does not need to depend on a live LLM.

Good first options:

- deterministic canned answers for known questions
- intent-based mapping from question patterns to structured mock responses
- a small server-side formatter that turns matched data into answer cards

This lets the experience feel real without requiring API keys.

## AI Response Rules

Mock AI responses should still include:

- direct answer
- supporting insights
- time range
- plant scope
- source labels
- chart metadata when relevant

## Supabase Decision Rule

Do not use Supabase just to store dummy data.

Only add Supabase if the mockup needs persistence features such as:

- saved dashboards
- shared query history
- lightweight auth

If the mockup is just a demoable product surface, local data is better.

## Data Quality Simulation

To make the mockup feel more real, it is acceptable to simulate:

- slightly delayed refresh timestamps
- one or two incomplete fields
- confidence labels on AI answers
- alerts based on rolling baselines

## Example Mock Answer Shape

```json
{
  "question": "Which plant needs attention first today?",
  "summary": "Plant 2 needs the most attention today because it has the lowest OEE, the highest scrap rate, and two active high-severity alerts.",
  "insights": [
    "OEE is down 5.4 points versus yesterday.",
    "Scrap rate is the highest among all four plants.",
    "Downtime minutes are above the recent 7-day baseline."
  ],
  "context": {
    "timeRange": "today",
    "plants": ["Plant 2"],
    "sources": ["MES", "CMMS", "ERP"]
  },
  "chart": {
    "type": "bar",
    "title": "Plant Risk Comparison - Today"
  }
}
```

