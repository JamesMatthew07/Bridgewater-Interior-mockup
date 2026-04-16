# Bridgewater Mockup

Mockup-first implementation scaffold for the BWI Operations Intelligence Dashboard.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- local mock data
- owned `shadcn/ui`-style primitives
- Recharts for mock analytics visuals
- hybrid OpenAI-compatible query route with seeded fallback

## Run

1. Install Node.js `20.9+`
2. Install dependencies
3. Start the dev server

```bash
npm install
npm run dev
```

## Environment Variables

Create a local `.env.local` from `.env.example` if you want the query page to
attempt live model responses.

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

Notes:

- If `OPENAI_API_KEY` or `OPENAI_MODEL` is missing, `/query` stays fully usable
  and falls back to the seeded mock answers.
- `OPENAI_BASE_URL` is optional and exists to support OpenAI-compatible
  providers.

## Included Routes

- `/` overview dashboard
- `/plants/[plantId]` plant detail
- `/alerts` alert monitoring
- `/query` mock AI query workspace

## Included API Routes

- `GET /api/overview`
- `GET /api/alerts`
- `GET /api/plants`
- `GET /api/plants/:plantId`
- `GET /api/query`
- `POST /api/query`

## Project Shape

```text
app/
components/
components/ui/
components/charts/
lib/
lib/mock-data/
lib/types/
docs/
```

## Mockup Intent

This scaffold is intentionally optimized for the demoable mockup phase:

- realistic local dummy data
- planted operational storylines
- chart-backed AI-style answers
- live AI on `/query` only, with seeded fallback
- clean upgrade path to real MES, ERP, and CMMS integrations later
