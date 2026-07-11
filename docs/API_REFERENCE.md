---
type: canonical
source: none
sync: none
sla: none
---

# LLM Works Backend Reference

Last updated: 2026-07-11

This document describes the backend surface that exists in the repository today.
LLM Works does not currently expose a general REST API, WebSocket API, SDK, or
provider-backed benchmark scoring service.

## Current backend surface

The current frontend uses the Supabase edge function named `benchmarks` through
`src/integrations/supabase/benchmarks.ts`.

Available operations:

- `GET benchmarks`: list planned benchmark presets.
- `GET benchmarks/:id/results`: list persisted result rows for the signed-in
  user and benchmark id.
- `POST benchmarks/:id/run`: queue a benchmark run record.

The `POST` operation creates a `benchmark_runs` row with `status: "pending"`.
It does not call model providers, run benchmark datasets, or score output.

## Authentication

The edge function requires a valid Supabase authenticated user. Requests without
a valid user return `401 Unauthorized`.

## Benchmark definitions

`GET benchmarks` returns static benchmark preset metadata such as:

```json
[
  {
    "id": "mmlu",
    "name": "MMLU",
    "description": "Massive Multitask Language Understanding",
    "categories": 57
  }
]
```

These definitions are presets for run tracking. They are not proof that scoring
for the dataset has been implemented.

## Queue a benchmark run

Client helper:

```ts
queueBenchmarkRun('mmlu', {
  models: ['gpt-4o'],
  config: { source: 'BenchmarkRunner' },
});
```

Edge-function route:

```http
POST /functions/v1/benchmarks/mmlu/run
Authorization: Bearer <supabase-user-token>
Content-Type: application/json

{
  "models": ["gpt-4o"],
  "config": { "source": "BenchmarkRunner" }
}
```

Response:

```json
{
  "runId": "<uuid>",
  "status": "pending",
  "message": "Benchmark run queued. Provider-backed scoring is not yet implemented."
}
```

## Results

`GET benchmarks/:id/results` reads `benchmark_results` rows for the signed-in
user. The table exists so a future worker can persist scored outputs. The current
app does not include that worker.

## Database tables

The benchmark queue is backed by:

- `public.benchmark_runs`
- `public.benchmark_results`

Both tables are defined in `supabase/migrations/20260711000000_benchmark_runs.sql`.
Generated TypeScript types live in `src/integrations/supabase/types.ts`.

## Explicit non-goals in the current implementation

- No provider inference API calls.
- No benchmark dataset execution.
- No benchmark scoring.
- No cryptographic proof system.
- No server-side provider-key encryption claim.
- No public REST/WebSocket API beyond Supabase edge-function invocation.

Update this reference in the same PR that adds any new backend capability.
