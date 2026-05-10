# LLMWorks

LLMWorks is an LLM evaluation and security-testing workbench. It provides a
browser-based surface for benchmark runs, provider-backed experiments, and
security-oriented inspection of model behavior.

This repo is not a generic chat wrapper. It exists to compare models, expose
failure modes, and keep evaluation workflows inspectable.

[llmworks.dev](https://llmworks.dev)

## What it does

- Runs evaluation and benchmark flows against configured providers
- Stores auth and data state through Supabase-backed flows
- Ships local UI for dashboards, reports, and experiment review
- Includes Playwright, accessibility, visual, and coverage-driven test surfaces

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS + Radix/shadcn-style primitives
- TanStack Query
- Supabase
- OpenAI and Anthropic integrations where configured
- Vitest + Playwright

## Quick start

```bash
npm install
npm run dev
```

Environment variables, including the production encryption salt, are documented
in [`.env.example`](.env.example).

## Validation

```bash
npm run build
npm run lint
npm run type-check
npm run test:run
npm run test:e2e
npm run test:accessibility
npm run test:visual
```

## Layout

```text
llmworks/
├── docs/              # Repo-local documentation
├── e2e/               # Playwright coverage
├── public/            # Static assets
├── scripts/           # QA and operational helpers
├── src/
│   ├── components/    # Shared UI
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Route-level screens
│   ├── stores/        # Client state
│   ├── types/         # Shared types
│   └── utils/         # Utilities
├── supabase/          # Backend and data support
├── tests/             # Repo-local test surfaces
├── AGENTS.md
├── CLAUDE.md
└── SSOT.md
```

## Runtime boundaries

- Keep route surfaces in `src/pages/`.
- Treat production encryption and provider keys as deployment-only secrets.
- Benchmark and security-testing logic should stay legible; do not hide core
  evaluation behavior behind opaque wrappers.

## Governance

- [AGENTS.md](AGENTS.md): repo rules and invariants
- [CLAUDE.md](CLAUDE.md): agent-facing context
- [SSOT.md](SSOT.md): current state and active decisions
