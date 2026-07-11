---
type: canonical
last_updated: 2026-06-29
---

# Repository topology

**Archetype:** `vite-react-spa`

LLM evaluation and benchmarking SPA with Supabase-backed persistence. Route
screens, shared UI, and integration code stay in separate `src/` lanes.

## On-disk layout

```text
llmworks/
├── docs/
├── e2e/
├── public/
├── scripts/
├── src/
│   ├── App.tsx
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   ├── main.tsx
│   ├── pages/
│   ├── styles/
│   └── test/
├── supabase/
├── tests/
├── index.html
├── package.json
└── vite.config.ts
```

## Role boundaries

- `src/pages/` owns route-level evaluation, arena, and settings screens.
- `src/components/` holds shared UI grouped by feature area (arena, bench, dashboard).
- `src/hooks/` and `src/lib/` own client helpers and shared logic.
- `src/api/` and `src/integrations/` wrap provider and Supabase calls.
- `supabase/` holds auth, persistence, RLS, edge functions, and migration-managed
  schema. Provider-key encryption is not implemented by the current app.
- `e2e/` and `tests/` cover Playwright and unit surfaces; `public/` serves static assets.

## Related

- [architecture.md](../architecture.md): evaluation engine, data flow, and dependencies.
