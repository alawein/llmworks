# LLMWorks

Status:      active
Category:    ventures
Owner:       alawein
Visibility:  private
Purpose:     LLM evaluation, benchmarking, and security testing playground.
Next action: continue

LLMWorks is an LLM evaluation and security-testing workbench. It provides a
browser-based surface for benchmark runs, provider-backed experiments, and
security-oriented inspection of model behavior. This repo is not a generic chat
wrapper: it compares models, exposes failure modes, and keeps evaluation
workflows inspectable.

[![CI](https://github.com/alawein/llmworks/actions/workflows/ci.yml/badge.svg)](https://github.com/alawein/llmworks/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Value proposition

LLMWorks runs evaluation and benchmark flows against configured providers,
stores auth and data state through Supabase-backed flows, and ships local UI for
dashboards, reports, and experiment review. Playwright, accessibility, visual,
and coverage-driven test surfaces guard regressions.

## Demo and status

- Lifecycle: `active`
- Visibility: `private`
- Homepage: [llmworks.dev](https://llmworks.dev)

## Quick start

```bash
npm install
npm run dev
```

Environment variables, including the production encryption salt, are documented
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

Vite + React SPA with Supabase-backed persistence. Route surfaces stay in
`src/pages/`. Provider API keys are encrypted at rest via Supabase.

```text
llmworks/
├── docs/
├── e2e/
├── public/
├── scripts/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── stores/
│   ├── types/
│   └── utils/
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
