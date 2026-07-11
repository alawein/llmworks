---
type: canonical
source: none
sync: none
sla: none
---

# LLM Works User Guide

Last updated: 2026-07-11

## Current product state

LLM Works is an open-source React/Supabase interface for exploring LLM
evaluation workflows. The current app includes:

- scripted Arena demos;
- benchmark run queueing and tracking;
- provider and application configuration UI;
- sample comparison and analytics dashboards.

Provider-backed model calls, benchmark scoring, measured comparison metrics, and
production evaluation reports are not yet implemented. Any screen that shows
scripted or sample content should label it before the content is presented or
exported.

## Getting started

1. Open the hosted app or run the repository locally.
2. Use the Home page to understand which surfaces are demos, samples, or active
   run-tracking flows.
3. Use Arena to explore scripted evaluation interactions.
4. Use Bench to queue benchmark run records and inspect the scoring-pending
   state.
5. Use Settings to review provider and application configuration surfaces.

## System requirements

- Modern browser with JavaScript enabled.
- Network access for the hosted app and Supabase-backed run queueing.
- Local storage for preferences and cached UI state.

The current release does not send prompts to model providers from the frontend.
Do not treat any scripted Arena output, sample dashboard metric, or sample
comparison report as measured model behavior.

## The Arena

The Arena is a scripted demo workspace for exploring the intended evaluation
interaction model. It currently shows debate, creative, and explanation flows
without making provider calls.

### Debate mode

Debate mode uses fixed demo arguments, illustrative citations, and fixed sample
scores. The UI labels this as a scripted demo. Use it to review layout,
interaction pacing, and planned review affordances; do not treat the output as a
model-generated debate or verified research.

### Creative sandbox

Creative sandbox demonstrates the intended creator/refiner workflow. Treat the
content as sample flow material until provider inference and persistence are
wired.

### Explanation challenge

Explanation challenge demonstrates how audience-specific explanation review
could work. Treat its content as demo material, not evaluated model output.

## The Bench

The Bench currently queues benchmark run records and previews planned benchmark
presets. The UI names common benchmark families such as MMLU, TruthfulQA, and
GSM8K as planned presets, but it does not yet run those datasets through model
providers or score model output.

### Queueing benchmark runs

1. Select one or more model identifiers.
2. Select one or more planned benchmark presets.
3. Queue the run.
4. Review the queue status and the explicit scoring-pending message.

If scoring is not implemented for a selected run, LLM Works withholds fake
results instead of generating placeholder scores.

### Results tab

The Results tab contains sample records for interface review. Sample percentages,
scores, winners, and exports are illustrative placeholders. They are not measured
provider output.

### Custom tests

The Custom Tests surface lets users draft and save evaluation prompts and
criteria. The runner is a setup preview until provider calls and scoring are
implemented.

## Comparison and dashboards

Comparison and analytics surfaces use sample data unless a screen explicitly
states that it is showing measured output from a real run. Exported comparison
reports must carry the same sample-data disclosure shown in the UI.

## Settings

Settings contains provider and application configuration surfaces. Treat provider
keys and related values as deployment secrets. Do not rely on a server-side
encryption-at-rest guarantee unless a future release documents and tests the
implementation.

## Accessibility

LLM Works includes accessibility-oriented controls and UI conventions:

- keyboard navigation and visible focus states;
- reduced-motion support;
- contrast and text-size controls where available;
- semantic landmarks and route headings.

Report accessibility regressions through the repository issue tracker.

## Troubleshooting

### Benchmark run does not produce scores

This is expected in the current release. Benchmark scoring and provider
inference are not yet implemented.

### Arena output looks fixed

This is expected in the current release. Arena modes are scripted demos and
should label themselves as such.

### Sample report or dashboard metrics look unrealistic

Treat them as placeholders. File an issue if a sample surface is missing an
explicit disclosure.

### Supabase-backed queueing fails

Check the Supabase environment configuration and edge-function deployment. The
frontend can only queue run records when the backend schema and functions are
available.

## FAQ

**Q: Is LLM Works free to use?**
A: Yes. It is open source. Any future provider-backed evaluation cost would
depend on the model providers you configure.

**Q: Does the app currently call model providers?**
A: No. Current Arena and comparison surfaces are scripted or sample data, and
Bench scoring is not yet implemented.

**Q: Are sample metrics measured results?**
A: No. Sample metrics are placeholders for interface review.

**Q: Can I export results?**
A: Sample exports are labeled as sample data. Measured evaluation exports require
future provider-backed scoring.

**Q: Do you store my API keys?**
A: Treat provider keys as sensitive configuration. The docs no longer claim
server-side encryption-at-rest until the implementation exists and is tested.

**Q: Can I run evaluations offline?**
A: You can review static UI locally, but Supabase-backed queueing requires the
backend services.

For additional help, visit the
[GitHub repository](https://github.com/alawein/aegis-ai-evaluator).
