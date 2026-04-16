# Mockup Scope

## Purpose

This document defines the version of the product we should build **right now**: a polished mockup application that looks and behaves like a credible pilot, even though it uses dummy data.

## Mockup Goal

Create a demo-ready version of the AI-Driven Operations Intelligence Dashboard that proves:

- the information architecture
- the dashboard experience
- the alerting experience
- the natural-language query experience
- the overall product value proposition

## What This Mockup Is

The mockup should feel like a near-real product:

- visually polished
- logically consistent
- populated with realistic manufacturing data
- capable of showing meaningful trends, alerts, and AI-style answers

## What This Mockup Is Not

The mockup is not required to include:

- live MES, ERP, or CMMS integrations
- production authentication
- production-grade ETL pipelines
- a required database
- advanced infrastructure

## Build Philosophy

The first build should optimize for:

1. believable product experience
2. clean architecture
3. easy future expansion
4. low implementation friction

## Required Mockup Deliverables

The mockup should include these pages or equivalent views:

- overview dashboard
- plant detail page
- alerts view
- natural-language query view

## Required Behaviors

The mockup should demonstrate:

- KPI cards across four plants
- trend charts with sensible time filters
- anomaly alerts with severity and explanation
- AI answer cards tied to dummy data
- drill-down from summary to plant-specific context

## Data Rules

- Use dummy data only.
- The data must look operationally realistic.
- Trends should tell a believable story.
- At least some anomalies should be intentionally planted so alerts and AI answers have something meaningful to explain.

## Technical Rules

- Prefer the simplest architecture that still feels professional.
- Keep the app ready for future real integrations.
- Do not introduce Supabase, Render services, or complex backend layers unless the user explicitly asks or the need is clear.

## Deployment Rules

- Treat `Vercel` as the default home for the Next.js mockup.
- Treat `Render` as optional future infrastructure for a separate backend service, ingestion job, or API layer.

## Mockup Success Criteria

The mockup is successful if a stakeholder can open it and quickly believe:

- this product solves a real reporting problem
- the cross-plant intelligence is valuable
- the AI layer is useful and grounded
- the product could realistically be piloted next

## Demo Narrative

The mockup should support a clear story:

1. Start on the executive dashboard.
2. Notice a KPI change or alert.
3. Drill into a plant.
4. Ask a natural-language question.
5. Receive a concise answer with a supporting chart.

