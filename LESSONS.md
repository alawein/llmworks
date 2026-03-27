---
type: canonical
source: none
sync: none
sla: none
authority: observed
audience: [ai-agents, contributors, future-self]
last-verified: 2026-03-09
last-updated: 2026-03-04
---

# LESSONS — LLM Works

> Observed patterns only. Minimal initial entry — update as lessons accumulate.

## Patterns That Work

- **Provider-agnostic evaluation schema**: Defining evaluation metrics independently of any specific LLM provider (OpenAI, Anthropic, etc.) allows benchmarking across models without rewriting test harnesses.
- **Rebrand history awareness**: This project was formerly Aegis AI; keep migration notes accessible so agents don't confuse old artifacts or references with the current codebase.

## Anti-Patterns

- **Hardcoding model names in evaluation configs**: Model identifiers change frequently (e.g., `gpt-4` → `gpt-4-turbo`); use versioned aliases and a central model registry.
- **Running evaluation jobs synchronously in the request path**: LLM evaluations are slow; always queue them asynchronously and surface results via a polling or webhook mechanism.

## Pitfalls

- **API rate limits silently skewing benchmark results**: Throttled responses look like slow models; instrument rate limit events separately from actual latency measurements.
- **Vercel deployment limits for long-running eval tasks**: Serverless functions have execution time caps; offload long evaluations to a dedicated worker or background job system.
