---
type: canonical
source: _devkit/templates
sync: propagated
sla: none
---

# Contributing to llmworks

LLM evaluation, benchmarking, and security testing playground.

This project follows the [alawein org contributing standards](https://github.com/alawein/alawein/blob/main/CONTRIBUTING.md).

## Getting Started

```bash
git clone https://github.com/alawein/llmworks.git
cd llmworks
npm install
```

## Development Workflow

1. Branch off `main` using prefix: `feat/`, `fix/`, `docs/`, `chore/`, `test/`
2. Make your changes — keep PRs focused on a single concern
3. Run `npm run test:run` to validate your changes before committing
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): subject`
5. Open a Pull Request to `main`

## Code Standards

- Vite + React 19 + TypeScript, Radix UI + Tailwind
- Supabase for auth and data
- Crypto-JS for client-side encryption
- Vitest for unit tests, Playwright for E2E

## Pull Request Checklist

- [ ] CI passes (no failing checks)
- [ ] Tests added or updated for new functionality
- [ ] `npm run lint && npm run type-check && npm run test:run` passes
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] No breaking changes without a version bump plan

## Reporting Issues

Open an issue on the [GitHub repository](https://github.com/alawein/llmworks/issues) with steps to reproduce and relevant context.

## License

By contributing, you agree that your contributions will be licensed under [MIT](LICENSE).
