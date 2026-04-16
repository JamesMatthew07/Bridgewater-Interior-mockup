# Codex Working Guidelines

This file is written for future Codex sessions working in this repository.

## Mission

Build an executive-ready manufacturing operations dashboard for BWI, starting from documentation-first context and evolving toward a real application.

## Current Build Mode

For the next implementation phase, assume the team is building a **mockup-first version**.

That means:

- build for demo quality first
- use realistic dummy data
- keep architecture simple
- avoid adding infrastructure unless it clearly improves the mockup

For mockup-specific decisions, read:

- `08-mockup-scope.md`
- `09-mockup-tech-stack.md`
- `10-mockup-ux-architecture.md`
- `11-mockup-data-strategy.md`
- `12-mockup-build-plan.md`

## How To Interpret The Repo Right Now

- The repo now contains a working mockup-first Next.js application scaffold.
- The docs remain the primary product context and design reference.
- Assume the next major tasks are polish, verification, and iterative feature
  expansion rather than first-time scaffolding.

## Implementation Priorities

When choosing what to build first, prioritize in this order:

1. Clear information architecture
2. Typed data models and mock data
3. Dashboard experience
4. Alerting experience
5. Natural-language query experience
6. Real integration readiness

## Coding Guidance

- Prefer modular, typed code.
- Keep business terms explicit and readable.
- Use realistic mock data, not placeholder nonsense.
- Make charts and KPI cards visually credible for manufacturing analytics.
- Keep AI outputs grounded in structured data.

## UX Guidance

- The UI should look serious, modern, and executive-ready.
- Avoid generic admin-dashboard aesthetics.
- Optimize for quick scanning and confident decision-making.
- Use charts intentionally; do not overload screens.

## Data Guidance

- Keep a strong separation between raw data, calculated KPIs, alerts, and AI response objects.
- Design for four plants from the start.
- Treat time range, plant, and metric as first-class filters.

## AI Guidance

- AI is a decision-support layer, not the product's only interface.
- Every answer should be traceable to data scope and time range.
- Prefer structure over free-form text.
- If data is missing, surface that directly.

## If You Need To Make Assumptions

Use these defaults unless the user says otherwise:

- Next.js is a good default frontend choice.
- Next.js 16 with App Router is the preferred default.
- Mock data is acceptable early on.
- Plant names stay generic until real names are provided.
- KPI set centers on OEE, scrap rate, OTIF, inventory health, and downtime.
- shadcn/ui should use the Radix base.
- Supabase is optional, not required, for the initial mockup.
- Render is optional and should not be introduced unless the app needs a separate backend service.

## What Good Progress Looks Like

A strong next implementation step would produce:

- a polished dashboard shell
- realistic seeded data
- cross-plant KPI cards
- trend charts
- an alerts panel
- a query interface placeholder or first functional version

## What To Avoid

- building isolated demo screens with no shared data model
- hard-coding logic that prevents real integrations later
- overcomplicating the architecture before the MVP exists
- ungrounded AI chat behavior that cannot explain its outputs
