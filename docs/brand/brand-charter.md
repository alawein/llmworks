---
type: canonical
source: none
sync: none
sla: none
---

# LLM Works Brand Charter

Last updated: 2026-07-11

## 1. Mission

Help teams explore LLM evaluation workflows with clear, honest interfaces that
separate working product behavior from demos, samples, and planned scoring.

## 2. Vision

LLM Works should become a trustworthy open-source evaluation workbench where
qualitative experiments, benchmark run tracking, and provider-backed scoring can
share one legible product surface.

## 3. Core principles

- Truthful by default: never present scripted demos, sample metrics, or planned
  scoring as measured model output.
- Evidence-first: show sources, methods, and implementation state plainly.
- Human-centered: keep flows understandable for researchers, engineers, and
  product teams.
- Security-aware: treat provider keys and deployment secrets as sensitive
  operator data.
- Accessible: keep product and docs language clear, inclusive, and testable.

## 4. Current positioning

For AI researchers, ML engineers, and product teams exploring LLM evaluation
workflows, LLM Works provides a React/Supabase interface for scripted Arena
demos, benchmark run tracking, provider configuration UI, and sample analytics.
Provider-backed model calls, benchmark scoring, and measured comparison reports
are not yet implemented.

## 5. Current differentiators

- Arena demos: scripted debate, creative, and explanation flows that show the
  intended interaction model without claiming live model output.
- Bench tracking: benchmark run records can be queued and tracked while scoring
  integration is still pending.
- Honest comparison UI: model comparison dashboards use illustrative sample data
  and disclose that status before export.
- Local-first product posture: provider credentials are operator secrets and must
  not be described as server-encrypted until code backs that claim.
- Shared design system: Radix/Tailwind surfaces with explicit demo labels,
  accessible navigation, and consistent status copy.

## 6. Messaging pillars

- Transparency: users can tell what is live, what is sample, and what is planned.
- Evaluation workflow clarity: Arena, Bench, comparison, and dashboard routes map
  to distinct product jobs.
- Implementation honesty: docs and UI should match the current codebase.
- Responsible progress: planned evaluation features are described as roadmap work,
  not existing guarantees.

## 7. Narrative and boilerplate

LLM Works is an open-source LLM evaluation interface for exploring Arena demos,
queueing benchmark run records, configuring providers, and reviewing sample
comparison dashboards. Benchmark scoring and provider-backed measured results are
still in progress.

## 8. Tagline options

- Evaluate LLM workflows with confidence
- Clear demos today, measured scoring next
- LLM evaluation surfaces without hidden claims

## 9. Voice and tone

- Product UI: concise, neutral, and explicit about demo/sample states.
- Documentation: practical, precise, and grounded in the current repository.
- Marketing: confident only where the product behavior is implemented.
- Errors and empty states: direct, actionable, and free of invented progress.

## 10. Copy patterns

- Home H1: Evaluate LLM workflows with confidence
- Home subhead: Explore scripted demos, sample metrics, and benchmark run
  tracking while provider-backed scoring is in progress.
- Arena H1: The Arena - scripted evaluation demos
- Arena subhead: Debate, create, and explain with demo content that is clearly
  labeled as non-provider output.
- Bench H1: The Bench - benchmark run tracking
- Bench subhead: Queue benchmark run records and preview planned presets; scoring
  is not yet implemented.
- Settings H1: Settings
- Settings subhead: Configure provider and application preferences.
- 404: Not found. Let's get you back on track.

## 11. SEO title/description templates

- Home: LLM Works - LLM Evaluation Workflow Interface
  - Description: Explore scripted Arena demos, sample metrics, and benchmark run
    tracking while provider-backed scoring is in progress.
- Arena: The Arena | LLM Works
  - Description: Scripted debate, creative, and explanation demos for exploring
    LLM evaluation workflows.
- Bench: The Bench | LLM Works
  - Description: Queue benchmark run records and preview planned benchmark
    presets. Scoring is not yet implemented.
- Settings: Settings | LLM Works
  - Description: Configure provider and application preferences.
- Dashboard: Dashboard | LLM Works
  - Description: Review sample analytics and current application status.

## 12. Accessibility and motion

- Respect `prefers-reduced-motion`.
- Provide visible focus states and sufficient color contrast.
- Use semantic landmarks and one H1 per page.

## 13. Compliance and ethics starter

- Disclose synthetic or scripted judgments before showing them.
- Document evaluation data sources and licensing before enabling real scoring.
- Provide clear export labels for sample data versus measured data.

## 14. Success metrics

- Users can identify demo/sample/planned states without reading source code.
- Benchmark run records queue reliably.
- Provider-backed scoring ships with tests, schema alignment, and documentation.

End of Brand Charter
