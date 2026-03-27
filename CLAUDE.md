---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [agents, contributors]
last-verified: 2026-03-22
---

# llmworks — Claude Code Configuration

## Project Context

LLMWorks — open-source LLM evaluation platform for security testing and benchmarking of language models. Rebranded from Aegis AI (Jan 2025). Supabase backend, OpenAI + Anthropic API integrations.

## Commands

```bash
npm run dev              # Vite dev server
npm run build            # production build
npm run test             # Vitest watch mode
npm run test:run         # run all tests once
npm run test:e2e         # Playwright E2E tests
npm run test:coverage    # coverage report
npm run test:visual      # visual regression tests
npm run lint             # ESLint
npm run format           # Prettier formatting
npm run type-check       # TypeScript validation
```

## Architecture

**Stack:** Vite + React 19 + TypeScript, Radix UI, Tailwind CSS 4, TanStack Query, React Router 6, Supabase (auth + DB), OpenAI + Anthropic SDKs, Recharts (charts), React Hook Form + Zod, Crypto-JS (encryption).

**Structure:**
- `src/components/` — reusable UI components
- `src/pages/` — page components
- `src/hooks/` — custom React hooks
- `src/stores/` — state management
- `src/utils/` — utility functions
- `supabase/` — database config
- `e2e/` — E2E test specs

**Deployment:** Vercel. Docker support available. Node >= 18, npm >= 8.

## Quick Links

- Governance: [AGENTS.md](AGENTS.md)
- Shared governance guides: [../../../docs/shared/](../../../docs/shared/)

## Session Bootstrap

Before working:
1. Run `git log --oneline -5` to see recent work
2. Read `docs/operations/backlog.md` for open work

## Work Style

- Execute, do not plan. When asked to do something, do it.
- One change at a time. Make the smallest complete change, verify, then move to next.
- If stuck for >2 tool calls, stop and ask.

## Environment

- Git configured for LF (not CRLF)
- No credentials in chat; use `gh secret set` or `vercel env add` instead
