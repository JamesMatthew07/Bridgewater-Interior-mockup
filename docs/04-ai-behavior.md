# AI Behavior

## AI Features In Scope

The product includes two primary AI capabilities:

1. Natural-language analytics queries
2. Anomaly explanation and summarization

## What The AI Should Do

The AI should help users:

- ask operational questions in plain English
- get concise answers based on available data
- see supporting charts or metrics
- understand anomalies and likely drivers
- move from raw data to action faster

## What The AI Must Not Do

- Invent data that is not present
- Give precise conclusions without evidence
- Hide uncertainty or missing context
- Return vague generic business advice unrelated to the actual metrics

## Query Types To Support

The first implementation should handle:

- metric lookup
- trend summary
- plant comparison
- time-period comparison
- alert explanation
- simple root-cause style analysis grounded in available metrics

## AI Answer Contract

Every AI answer should aim to include:

1. Direct answer in 1-3 sentences
2. Supporting observations
3. A chart or chart recommendation when useful
4. Time range used
5. Plant or scope used
6. Data sources used or referenced
7. Clear uncertainty note when data is incomplete

## Example Answer Shape

```json
{
  "summary": "Plant 2 had the largest OEE drop yesterday, driven primarily by higher downtime and a lower quality rate.",
  "insights": [
    "OEE fell 6.2 points versus the prior day.",
    "Downtime minutes increased 18 percent.",
    "Scrap rate also worsened slightly, amplifying the decline."
  ],
  "chart": {
    "type": "line",
    "title": "Plant 2 OEE vs Downtime - Last 7 Days"
  },
  "context": {
    "plants": ["Plant 2"],
    "timeRange": "yesterday",
    "sources": ["MES", "CMMS"]
  },
  "confidence": "medium"
}
```

## Natural-Language Query UX

The query experience should feel like a decision-support tool, not a general chatbot.

Recommended UI behaviors:

- show suggested prompts
- keep responses structured and scannable
- show which filters were applied
- let users inspect the supporting chart
- preserve recent queries in session history

## Suggested Prompt Examples

- Which plant has the worst scrap trend this week?
- Why is OTIF down this month?
- Show the last 30 days of downtime for Plant 3.
- Which plant needs attention first today?
- What changed most since yesterday?

## Anomaly Detection Guidance

The system should generate alerts when a metric meaningfully deviates from normal behavior. Early versions can use simple statistical or rule-based methods before moving to more advanced models.

Good starting rules:

- sudden spike above rolling baseline
- sustained degradation across multiple periods
- threshold breach for critical KPI
- unusual change relative to plant's own history

## Explainability Rules

When AI explains an alert, it should:

- name the affected metric
- identify the time window
- compare against a baseline or prior period
- reference likely contributing metrics if available
- avoid claiming root cause if only correlation is available

## Fallback Behavior

If the question cannot be answered confidently:

- say what data is missing
- say what scope was attempted
- provide the closest valid insight available

## Quality Bar

An AI answer is good if a plant manager can read it quickly, trust it, and act on it without needing a second translation step from an analyst.

