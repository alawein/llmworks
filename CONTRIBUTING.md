---
type: canonical
source: none
sync: none
sla: none
---

# Contributing to LLM Works

Thank you for your interest in contributing. This project follows the [alawein org contributing standards](https://github.com/alawein/alawein/blob/main/CONTRIBUTING.md); below is the repo-specific summary.

## Getting Started

```bash
git clone https://github.com/alawein/llmworks.git
cd llmworks
npm install
npm run dev   # http://localhost:8080
```

## Branch Naming

- `main` — production-ready; use PRs for all changes
- `feat/*` — new features (e.g. `feat/arena`)
- `fix/*` — bug fixes
- `docs/*` — documentation only
- `hotfix/*` — urgent fixes
- `release/*` — release stabilization

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(bench): add Elo ranking export`

## Pull Request Process

1. Branch from `main`; keep PRs focused (≤300 lines preferred).
2. Ensure CI is green (lint, type-check, test, build).
3. Update docs if behavior or APIs change.
4. Add or update tests for new or changed behavior.
5. Request review; address feedback before merge.

## Development Commands

| Command              | Purpose                 |
|----------------------|-------------------------|
| `npm run dev`        | Dev server (port 8080)  |
| `npm run lint`       | ESLint                  |
| `npm run type-check` | TypeScript (if present) |
| `npm run test`       | Unit tests (Vitest)     |
| `npm run build`      | Production build        |

Vite + React + Supabase. See [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md).
