---
type: canonical
source: none
sync: none
sla: none
authority: canonical
audience: [ai-agents, contributors]
last_updated: 2026-05-30
last-verified: 2026-05-30
---

# CLAUDE.md: LLMWorks

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
- `src/lib/`: app logic helpers (analytics, SEO, environment, security)
- `src/api/`: API route handlers (e.g. `health.ts`)
- `src/integrations/supabase/`: Supabase client and generated types
- `src/styles/`: shared styles
- `src/test/`: vitest setup + accessibility/integration/performance specs
- `supabase/`: backend and data support
- `tests/`: vitest unit specs (`tests/lib/`) plus Playwright specs (`tests/e2e/`, `tests/visual/`); this is Playwright's `testDir`
- `e2e/`: additional Playwright specs and global setup/teardown (see Gotchas; NOT wired into the default `testDir`)
- `templates/`: static HTML design mockups (`option-a/`, `option-b/`, `option-c/`)
- `public/`: static assets (favicons, redirects)
- `docs/`: developer/API/deployment/security docs
- `reports/`: generated operational reports
- `scripts/`: ops scripts (`github-sync-report.mjs`, run via `npm run ops:sync-report`)

## Governance rules

1. Keep evaluation behavior inspectable. Do not bury core benchmark logic in
   opaque wrappers or side effects.
2. Do not reintroduce `VITE_API_KEY_ENCRYPTION_SALT` or client-side provider-key
   encryption claims unless code consumes that secret.
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

## Gotchas

1. Playwright `testDir` is `./tests`, so `e2e/*.spec.ts` (accessibility,
   navigation, global setup/teardown) is NOT collected by `playwright test` as
   configured. E2E specs that must run live under `tests/` (e.g.
   `tests/e2e/home.spec.ts`). Treat `e2e/` as orphaned until
   `playwright.config.ts` adds it.
2. `npm run test:visual` passes `--project=visual-regression`, but
   `playwright.config.ts` defines no such project (only `chromium`, plus optional
   `firefox`/`webkit` gated by `PLAYWRIGHT_INCLUDE_*` env vars). The command fails
   with no matching project; visual snapshots live in `tests/visual/__snapshots__/`.
3. Vitest unit specs are split across two trees: `src/test/*.test.tsx` and
   `tests/lib/*.test.ts`. The targeted scripts (`test:accessibility`,
   `test:integration`, `test:performance`) only point at `src/test/`; the
   `tests/lib/` specs run only under the broad `test` / `test:run`.

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
