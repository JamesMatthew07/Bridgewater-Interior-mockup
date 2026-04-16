# Bridgewater Mockup Docs

This `docs/` folder is the project context pack for Codex and future engineers.

The product we are building is an **AI-Driven Operations Intelligence Dashboard** for BWI. It combines data from MES, ERP, and CMMS across four plants into one analytics experience with:

- real-time KPI dashboards
- anomaly alerts
- plant comparison views
- a natural-language query interface with AI-generated answers and supporting charts

## Current Repo State

The repository now contains both the documentation pack and the first mockup
application scaffold.

That means these docs should still be treated as the main product and
architecture context, but future sessions should now reconcile them with the
implemented Next.js codebase rather than assuming the repo is docs-only.

## Recommended Reading Order

1. `01-project-brief.md`
2. `02-product-requirements.md`
3. `03-data-foundation.md`
4. `04-ai-behavior.md`
5. `05-system-architecture.md`
6. `06-delivery-plan.md`
7. `07-codex-working-guidelines.md`
8. `08-mockup-scope.md`
9. `09-mockup-tech-stack.md`
10. `10-mockup-ux-architecture.md`
11. `11-mockup-data-strategy.md`
12. `12-mockup-build-plan.md`

## Current Build Mode

The current expected implementation is a **mockup-first version** of the product.

That means:

- prioritize a polished, believable frontend experience
- use dummy data by default
- avoid unnecessary infrastructure for v1
- keep the codebase ready to upgrade into a real integrated product later

## Mockup Stack Defaults

Unless the user says otherwise, future Codex sessions should assume:

- `Next.js 16`
- `Tailwind CSS`
- `shadcn/ui`
- dummy data stored locally in the app
- `Vercel` as the default frontend deployment target
- `Supabase` only if persistence becomes necessary
- `Render` only if a separate backend service becomes necessary

## Core Product Statement

Build a unified operations intelligence dashboard that helps managers across four plants detect issues sooner, understand performance faster, and ask data questions in plain English without waiting for manually compiled reports.

## Non-Negotiable Outcomes

- Cross-plant visibility in one interface
- Fast access to OEE, scrap rate, OTIF, and inventory health
- Early anomaly detection for downtime, scrap spikes, and delivery risk
- Natural-language analytics that returns both explanations and visual evidence
- A foundation that other AI use cases can build on later

## Default Assumptions

Use these assumptions unless a later user instruction overrides them:

- There are four plants in scope for the pilot.
- Source systems are MES, ERP, and CMMS.
- The first product version should be MVP-first, modular, and demoable.
- Mock data is acceptable during early UI development, but data structures should look production-realistic.
- The UI should feel executive-ready, not like an engineering admin panel.
- AI answers must be grounded in available data and should expose the time range and source context used.

## Decision Priority

When future Codex sessions need to choose between conflicting inputs, use this order:

1. Latest explicit user instruction
2. Existing implemented code behavior
3. These docs
4. Reasonable engineering defaults

## Naming Conventions

- Company shorthand: `BWI`
- Product shorthand: `Operations Intelligence Dashboard`
- Plants: use `Plant 1`, `Plant 2`, `Plant 3`, `Plant 4` until real names are provided

## What Success Looks Like

The finished product should let a manager open one dashboard and immediately answer questions like:

- Which plant is trending worst on scrap this shift, today, or this week?
- What downtime patterns are getting worse?
- Which orders are at delivery risk?
- Why did OEE drop yesterday?
- How does inventory risk compare across plants?
