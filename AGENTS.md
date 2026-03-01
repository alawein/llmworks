---
type: normative
authority: canonical
audience: [agents, contributors, maintainers]
last-verified: 2026-03-01
---

# AGENTS -- llmworks

> LLM evaluation and security testing platform -- llmworks.dev

## Repository Scope

Vite + React + TypeScript application with shadcn/ui components and Supabase
backend. Features Arena (interactive model testing), Bench (benchmarking),
Arbiter evaluation framework, and dynamic Elo rankings.

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/pages/` | Route components (Index, Arena, Bench, NotFound) |
| `src/components/ui/` | shadcn/ui library (auto-generated, do not edit) |
| `src/integrations/supabase/` | Supabase client and types (auto-generated) |
| `src/lib/` | Utility functions |
| `src/hooks/` | Custom React hooks |

## Commands

- `npm install` -- install dependencies
- `npm run dev` -- start dev server (port 8080)
- `npm run build` -- production build
- `npm run build:dev` -- development build
- `npm run lint` -- ESLint
- `npm run preview` -- preview production build

## Agent Rules

- Read this file before making changes
- Never commit `.env` files or API keys
- Always run `npm run build` before proposing changes
- Do not edit `src/components/ui/` -- these are shadcn/ui generated
- Do not edit `src/integrations/supabase/` -- these are auto-generated
- Brand identity: "LLM Works" (rebranded from "Aegis AI" Jan 2025)
- Color palette: Analytical Blue (#4F83F0), Insight Orange (#FF7A2A)
- Routes are defined in `src/App.tsx` -- add new routes above the catch-all
- Use conventional commit messages: `feat(scope):`, `fix(scope):`, etc.

## Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `use*.ts`
- Utilities: `camelCase.ts`
- Path alias: `@/` maps to `./src/`
