# Mockup Tech Stack

## Default Stack

Use this stack for the mockup unless the user says otherwise:

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Lucide` icons
- a charting library such as `Recharts`
- local dummy data

## Framework Choice

`Next.js 16` is the preferred default because it gives us:

- App Router by default
- a strong routing model for multi-page dashboards
- server and client component flexibility
- clean deployment to Vercel
- an easy path from mock data to real APIs later

## Next.js 16 Rules

Future Codex sessions should follow these defaults:

- use App Router, not Pages Router
- prefer Server Components by default
- add `"use client"` only when interactivity requires it
- use `next/navigation`, not `next/router`
- use route handlers for APIs
- use the metadata API instead of `next/head`

## Styling Choice

Use `Tailwind CSS` for layout, spacing, tokens, and fast iteration.

The mockup should define a clear visual system early:

- typography scale
- spacing rhythm
- color tokens
- surface treatments
- chart color conventions

## UI Component Strategy

Use `shadcn/ui` as the component foundation.

Important guidance:

- initialize non-interactively
- use the default Radix base
- treat components as source code we own and customize

Recommended initialization command:

```bash
npx shadcn@latest init -d --base radix
```

Recommended initial components:

- `button`
- `card`
- `badge`
- `tabs`
- `table`
- `select`
- `input`
- `textarea`
- `dialog`
- `sheet`
- `tooltip`
- `skeleton`
- `separator`

## Data Strategy For The Mockup

Use local dummy data as the default source.

Recommended pattern:

- mock data lives in source-controlled files
- charts and cards read from typed data objects
- route handlers may wrap mock data if we want API-like boundaries

## Supabase Guidance

`Supabase` is optional for the mockup.

Do not add it by default.

Only introduce Supabase if the user explicitly wants one of these:

- persistent query history
- shared saved views
- authentication
- a real database-backed prototype

If none of those exist yet, keep the mockup database-free.

## Vercel Guidance

`Vercel` is the default deployment target for the mockup frontend because it fits the Next.js stack with minimal friction.

Use Vercel for:

- preview deployments
- demo hosting
- production-like frontend delivery

## Render Guidance

`Render` is optional and should not be required for the first mockup.

Use Render only if we later split out:

- a standalone backend API
- ingestion workers
- scheduled ETL or sync jobs
- heavier server-side services that should live outside the frontend app

## Recommended Codebase Shape

For a simple first version, prefer a single Next.js app rather than a monorepo.

Suggested structure:

```text
app/
components/
lib/
lib/mock-data/
lib/types/
public/
docs/
```

## Preferred Libraries

These are strong defaults, not hard requirements:

- charts: `Recharts`
- dates: `date-fns`
- icons: `lucide-react`
- class helpers: `clsx` and `tailwind-merge`
- animations: `framer-motion` only if needed for meaningful polish

## Anti-Goals

Avoid these during the mockup phase:

- adding too many infrastructure dependencies
- introducing a backend service with no clear need
- using placeholder lorem-ipsum style data
- building a generic admin UI with no visual opinion

