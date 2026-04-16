# Mockup Build Plan

## Goal

This plan defines how future Codex sessions should build the first mockup implementation.

## Recommended Build Order

1. Scaffold the Next.js 16 app foundation
2. Configure Tailwind and shadcn/ui
3. Define shared types and dummy data
4. Build the app shell and overview dashboard
5. Build plant detail pages
6. Build the alerts page
7. Build the query page
8. Add mock AI responses and chart-backed answers
9. Refine visual polish and demo flow

## Phase 1: Foundation

Expected outcomes:

- Next.js 16 App Router project
- TypeScript enabled
- Tailwind configured
- shadcn initialized with Radix base
- baseline layout and theme tokens

## Phase 2: Data Layer

Expected outcomes:

- typed dummy data
- mock overview dataset
- plant detail datasets
- alert datasets
- query response datasets

## Phase 3: Core Screens

Expected outcomes:

- polished landing dashboard
- working plant detail route
- working alerts route
- working query route

## Phase 4: Demo Intelligence

Expected outcomes:

- realistic alerts
- AI-style response cards
- planted operational storylines
- smooth drill-down flow across screens

## Phase 5: Polish

Expected outcomes:

- consistent design system
- loading states
- empty states
- strong chart readability
- demo-ready copy and interactions

## Definition Of Done For The Mockup

The mockup is ready when:

- it looks credible in a stakeholder demo
- the data tells a coherent operations story
- each route supports the overall narrative
- the AI query experience feels grounded
- no unnecessary infrastructure blocks iteration

## Deployment Plan

For the initial mockup:

- deploy the Next.js app to `Vercel`
- do not require Supabase
- do not require Render

If the project later expands, then:

- add `Supabase` for persistence only when needed
- add `Render` only if a separate backend service becomes valuable

## Codex Do

- keep the first version simple
- prefer believable data over backend complexity
- keep interfaces typed
- make the visuals feel premium and intentional
- design the code so real integrations can replace mocks later

## Codex Do Not

- do not overbuild infrastructure
- do not create fake data that looks random or toy-like
- do not make the AI feature a generic chatbot
- do not let the UX drift into a bland admin dashboard

## Strong First Deliverable

If future Codex sessions only have time for one major implementation pass, the strongest first deliverable is:

- a polished overview dashboard
- one plant detail page pattern
- an alerts view
- a query page with mock AI responses
- cohesive dummy data across all views

