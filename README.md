# LLMWorks

Status:      active
Category:    ventures
Owner:       alawein
Visibility:  private
Purpose:     LLM evaluation, benchmarking, and security testing playground.
Next action: continue

LLMWorks is an LLM evaluation and security-testing workbench UI. It provides
browser-based surfaces for evaluation concepts, comparison workflows, and
security-oriented inspection. Current arena and comparison data is explicitly
scripted or illustrative; provider execution and benchmark scoring are not yet
implemented in this repository.

[![CI](https://github.com/alawein/llmworks/actions/workflows/ci.yml/badge.svg)](https://github.com/alawein/llmworks/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Value proposition

LLMWorks ships a Vite/React interface with Supabase authentication support,
local dashboards, demo evaluation flows, and illustrative comparison reports.
It does not currently call model-provider SDKs or calculate benchmark scores.
Playwright, accessibility, visual, and coverage-driven test surfaces guard UI
regressions.

## Demo and status

- Lifecycle: `active`
- Visibility: `private`
- Homepage: [llmworks.dev](https://llmworks.dev)

## Quick start

```bash
npm install
npm run dev
```

Environment variables for the Vite client and Supabase connection are documented
in [`.env.example`](.env.example).

Validation:

```bash
npm run build
npm run lint
npm run type-check
npm run test:run
npm run test:e2e
npm run test:accessibility
npm run test:visual
```

## Architecture

Vite + React SPA with Supabase authentication and migration-managed schema.
Route surfaces stay in `src/pages/`. The repository currently has no provider
SDK integration, benchmark scoring implementation, or client-side key
encryption path; these claims will be added only when backed by code.

```text
llmworks/
├── docs/
├── e2e/
├── public/
├── scripts/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   └── test/
├── supabase/
├── tests/
├── AGENTS.md
├── CLAUDE.md
└── SSOT.md
```

See [docs/architecture.md](docs/architecture.md) for the evaluation engine
layout. See [docs/architecture/topology.md](docs/architecture/topology.md) for
the on-disk layout map.

## Deployment

LLMWorks deploys to Vercel at llmworks.dev. CI builds on push to `main`. See
[docs/deployment.md](docs/deployment.md) for environment configuration and
rollback procedures.

## Docs map

- [docs/README.md](docs/README.md)
- [SSOT.md](SSOT.md)
- [LESSONS.md](LESSONS.md)

## Ownership

- Maintainer: `alawein-core`
- Docs owner: `alawein-core`
