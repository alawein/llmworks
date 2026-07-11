---
type: canonical
source: none
sync: none
sla: none
---

# LLM Works Platform Overview

Last updated: 2026-07-11

## Executive summary

LLM Works is a Vite/React interface for exploring LLM evaluation workflows. The
current product includes scripted Arena demos, benchmark run queueing, provider
configuration surfaces, and sample comparison dashboards.

Provider-backed inference, benchmark dataset execution, benchmark scoring, and
measured evaluation reports are not yet implemented. Product copy and docs must
state that distinction wherever sample metrics or scripted outputs appear.

## Current architecture

| Component       | Technology                          | Current role                                                       |
| --------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Frontend        | Vite, React, TypeScript             | Route screens, scripted demos, sample dashboards, and run tracking |
| UI system       | Radix primitives, Tailwind CSS      | Shared components, themes, and accessible controls                 |
| Backend         | Supabase                            | Auth, Postgres tables, and edge functions                          |
| Benchmark queue | Supabase edge function `benchmarks` | Lists planned presets and queues `benchmark_runs` rows             |
| Types           | Generated Supabase types            | Keeps frontend data access aligned with migrations                 |

## Current capabilities

- **Arena demos**: scripted debate, creative, and explanation surfaces.
- **Bench run tracking**: queue benchmark run records and show scoring-pending
  state.
- **Comparison UI**: illustrative sample metrics with export disclosure.
- **Dashboards**: sample operational and analytics cards for interface review.
- **Settings**: application and provider configuration surfaces.

## Explicitly not implemented yet

- Provider inference calls from the frontend.
- Benchmark dataset execution.
- Benchmark scoring workers.
- Measured comparison reports.
- Cryptographic proof systems.
- Server-side provider-key encryption-at-rest claims.
- General REST or WebSocket API beyond the current Supabase edge-function
  invocation.

## Development commands

```bash
npm install
npm run type-check
npm run build
npm run lint
npm run test:run
npm run test:e2e
npm run test:accessibility
npm run test:visual
```

## Key file locations

- `src/pages/`: route screens.
- `src/components/`: shared UI and demo components.
- `src/integrations/supabase/`: Supabase client helpers and generated types.
- `supabase/functions/benchmarks/`: benchmark edge function.
- `supabase/migrations/`: database migrations.
- `docs/`: current-state product, backend, and contributor documentation.

## Documentation rule

Update this overview in the same PR that changes product capability. If a screen
uses scripted or sample data, the UI and docs must label it before users can act
on it or export it.
