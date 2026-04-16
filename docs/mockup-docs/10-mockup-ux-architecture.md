# Mockup UX Architecture

## UX Goal

The mockup should feel like an executive operations product, not a back-office admin template.

Users should be able to:

- understand the overall situation quickly
- compare plants confidently
- spot issues fast
- drill into detail without friction
- trust the AI assistance

## Primary Routes

The mockup should include these routes:

- `/` for the executive overview
- `/plants/[plantId]` for plant detail
- `/alerts` for anomaly monitoring
- `/query` for natural-language analysis

## Overview Page Structure

The overview page should include:

- top navigation or app shell
- global time-range filter
- KPI summary cards
- trend charts
- cross-plant comparison section
- alerts summary
- recent AI insight or featured analysis panel

## Plant Detail Page Structure

Each plant page should include:

- plant headline summary
- KPI cards for that plant
- time-series charts
- downtime and scrap context
- alert list scoped to the plant
- short AI-generated plant summary

## Alerts Page Structure

The alerts page should include:

- alert counts by severity
- filter controls
- alert feed or table
- expandable alert details
- small supporting charts or metric deltas

## Query Page Structure

The query page should include:

- prompt input area
- suggested questions
- query history for the current session
- structured answer card
- supporting chart area
- visible scope and source context

## Core Shared Components

The first mockup should likely include components like:

- `AppShell`
- `PageHeader`
- `TimeRangeFilter`
- `KpiCard`
- `TrendChartCard`
- `PlantComparisonTable`
- `AlertFeed`
- `AlertSeverityBadge`
- `QueryComposer`
- `AiAnswerCard`
- `SourceContextPills`
- `EmptyState`
- `LoadingSkeleton`

## shadcn/ui Mapping

Use shadcn primitives where they help speed and quality:

- `Card` for KPI and chart containers
- `Badge` for status and severity
- `Tabs` for switching between views or time slices
- `Table` for comparison and alert views
- `Select` for plant and range filters
- `Input` or `Textarea` for query entry
- `Sheet` or `Dialog` for deeper alert detail
- `Skeleton` for loading states

## Visual Direction

The design should feel:

- sharp
- industrial
- modern
- calm under pressure

A good default visual language:

- dark ink or steel-toned text
- clean light surfaces
- restrained accent colors
- strong chart contrast
- amber or red reserved for risk and alerts

## Information Hierarchy Rules

- Show the most important KPIs first.
- Do not bury alerts.
- Keep filters visible and understandable.
- Make plant comparison easy to scan.
- Keep AI answers structured and brief.

## Chart Guidance

Charts should support decision-making, not decorate the page.

Recommended chart types:

- line charts for KPI trends
- bar charts for cross-plant comparison
- stacked bars for downtime categories if needed
- small sparklines inside KPI cards when useful

## Interaction Rules

- Users should be able to move from summary to detail in one click.
- Filters should feel global when appropriate.
- Hover states and micro-animation should add clarity, not noise.
- Empty states should still teach the user what belongs there.

## Demo-First UX Rule

When choosing between fully realistic complexity and a cleaner demo, prefer the cleaner demo as long as it still reflects believable operations behavior.

