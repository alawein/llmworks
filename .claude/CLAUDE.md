---
type: reference
authority: canonical
audience: [agents, contributors]
last-verified: 2026-03-21
---

# llmworks — Claude Code Configuration

## Project Context

LLMWorks — open-source LLM evaluation platform for security testing and benchmarking of language models. Vite + React 19 + TypeScript, Supabase backend, OpenAI + Anthropic API integrations.

## Quick Links

- Governance: [AGENTS.md](AGENTS.md)
- Guidelines: [GUIDELINES.md](GUIDELINES.md)
- Shared governance guides: [../../../docs/shared/](../../../docs/shared/)

## Session Bootstrap

Before working:
1. Run `git log --oneline -5` to see recent work
2. Read `docs/operations/backlog.md` for open work
3. Use `/bootstrap` skill to load full context

## Work Style

- Execute, do not plan. When asked to do something, do it.
- One change at a time. Make the smallest complete change, verify, then move to next.
- If stuck for >2 tool calls, stop and ask.

## Test Gates

After modifying code, run relevant tests before proceeding.

## Hooks

Hooks in `.claude/settings.json` auto-validate files:
- Python files: ruff check, mypy
- TypeScript files: typecheck, lint, test

## Environment

- Git configured for LF (not CRLF)
- Python: use `python` (not `python3`)
- No credentials in chat; use `gh secret set` or `vercel env add` instead
