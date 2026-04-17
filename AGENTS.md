---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [agents, contributors, maintainers]
last_updated: 2026-04-15
last-verified: 2026-04-15
---

# AGENTS — LLMWorks

## Workspace identity

LLMWorks is a Vite/React evaluation and security-testing product for LLM
experiments and operator-visible benchmarking.

## Directory structure

- `src/pages/`: route screens
- `src/components/`: shared UI
- `src/stores/`: client state
- `src/utils/`: utilities
- `supabase/`: backend support
- `e2e/`, `tests/`: required verification
- `scripts/`: QA helpers

## Governance rules

1. Keep evaluation and benchmark behavior legible.
2. Treat provider keys and encryption salt as deployment secrets only.
3. Keep route surfaces in `src/pages/`.
4. Do not reduce security-testing flows to decorative UI or placeholder copy.
5. Preserve test coverage around provider integration and benchmark paths.

## Code conventions

- React + TypeScript
- Existing Radix/Tailwind stack stays canonical
- Comments explain benchmark, security, or provider constraints
- Conventional commits only

## Build and test commands

```bash
npm install
npm run build
npm run lint
npm run type-check
npm run test:run
npm run test:e2e
npm run test:accessibility
npm run test:visual
```
