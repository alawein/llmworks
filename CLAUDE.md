---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [ai-agents, contributors]
last_updated: 2026-04-15
last-verified: 2026-04-15
---

# CLAUDE.md — LLMWorks

## Workspace identity

LLMWorks is an LLM evaluation and security-testing workbench. The repo exists
to run experiments, compare models, and expose failure modes in a way that
stays visible to operators.

Shared voice and workspace prompt:

- <https://github.com/alawein/alawein/blob/main/docs/style/VOICE.md>
- <https://github.com/alawein/alawein/blob/main/prompt-kits/AGENT.md>

## Directory structure

- `src/pages/`: route-level screens
- `src/components/`: shared UI
- `src/hooks/`: custom hooks
- `src/stores/`: client state
- `src/utils/`: utilities
- `supabase/`: backend and data support
- `e2e/`: Playwright coverage
- `tests/`: repo-local verification
- `scripts/`: QA and operational helpers

## Governance rules

1. Keep evaluation behavior inspectable. Do not bury core benchmark logic in
   opaque wrappers or side effects.
2. Treat `VITE_API_KEY_ENCRYPTION_SALT` as a deployment secret, not as a
   checked-in convenience default.
3. Provider keys and Supabase credentials stay out of version control.
4. Route surfaces belong in `src/pages/`.
5. Security-testing flows are first-class product paths. Preserve them when
   changing dashboards or experiment UI.

## Code conventions

- React + TypeScript
- Prefer the existing Radix/Tailwind component stack over a second UI layer
- Keep provider integration and evaluation utilities explicit in naming and
  error handling
- Comments explain benchmark, security, or provider constraints, not obvious UI
  behavior

## Build and test commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run type-check
npm run test:run
npm run test:e2e
npm run test:accessibility
npm run test:visual
```
