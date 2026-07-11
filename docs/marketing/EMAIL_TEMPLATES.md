---
type: canonical
source: none
sync: none
sla: none
---

# Email Announcement Templates - LLM Works

These templates are drafts. Do not send them as customer communication until the
claims are re-verified against the live product.

## Current-state announcement

### Subject line options

1. "LLM Works: clearer evaluation workflow demos"
2. "LLM Works update: demo labels and benchmark run tracking"
3. "What LLM Works supports today"

### Main email draft

```text
Hi [FirstName],

LLM Works is an open-source interface for exploring LLM evaluation workflows.
We have tightened the product language so the UI and docs distinguish working
features from demos, samples, and planned scoring.

What is available today:
- The Arena: scripted debate, creative, and explanation demos
- The Bench: benchmark run queueing and tracking
- Compare: illustrative sample metrics labeled before export
- Dashboard: sample analytics for interface review
- Settings: provider and application configuration surfaces

What is still in progress:
- provider-backed model calls
- benchmark scoring
- measured comparison reports
- production evaluation exports

The product standard is simple: sample data should be useful for reviewing the
interface, but it must never be presented as measured model output.

Thanks,
The LLM Works Team
```

## Technical team update

```text
Subject: LLM Works implementation-state update

Hi [FirstName],

This update clarifies what LLM Works currently does and does not do.

Current implementation:
- React/Supabase application shell
- authentication and settings surfaces
- benchmark run records backed by Supabase functions
- scripted Arena demos
- sample comparison and dashboard records

Not implemented yet:
- provider inference calls from the frontend
- benchmark dataset execution
- benchmark scoring
- cryptographic proof or server-side encryption claims for provider keys

If you are evaluating LLM Works for a team workflow, treat the current product
as an evaluation-interface preview plus benchmark run tracking. Do not treat
sample metrics as measured model performance.

Best,
The LLM Works Team
```

## Early access note

```text
Subject: Early access: explore LLM Works demos and run tracking

Hi [FirstName],

Welcome to LLM Works early access.

You can explore scripted Arena demos, queue benchmark run records, and review
sample comparison dashboards. Provider-backed scoring is still in progress, so
the app labels demo and sample data before presenting or exporting it.

What we would like feedback on:
- Are demo/sample labels visible enough?
- Does Bench queueing make the scoring-pending state clear?
- Are the planned evaluation workflows understandable?
- Which provider-backed scoring flow should ship first?

Reply with feedback or file an issue in the repository.

The LLM Works Team
```

## Required pre-send checklist

- [ ] The template does not claim live model calls unless the feature exists.
- [ ] The template does not claim measured benchmark scores unless scoring
      exists.
- [ ] The template does not claim audit trails, proofs, encryption-at-rest, or
      compliance reports unless code and tests back the claim.
- [ ] Demo/sample data is labeled before any metric, winner, score, or export is
      mentioned.

_Updated: July 11, 2026_
