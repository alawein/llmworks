---
type: canonical
source: none
sync: none
sla: none
---

# LLM Works Examples

Last updated: 2026-07-11

These examples match the current implementation. They do not describe measured
model evaluations, benchmark scoring, or provider-backed reports.

## Example 1: Review a scripted Arena debate

Use this example when checking whether the Arena disclosure is clear.

1. Open `/arena`.
2. Choose Debate mode.
3. Confirm the page states that it is a scripted demo with no provider calls or
   verified citations.
4. Start the demo.
5. Review the fixed sample arguments and illustrative arbiter notes.

Expected result: the demo is useful for interface review, but it does not read as
model output.

## Example 2: Queue a benchmark run record

Use this example to exercise the Supabase benchmark queue.

1. Open `/bench`.
2. Select a model identifier, such as `GPT-4o`.
3. Select a planned benchmark preset, such as `MMLU`.
4. Click `Queue Benchmark Run`.
5. Confirm the queued run appears with `pending` status.
6. Confirm the page states that benchmark scoring is not yet available.

Expected result: a `benchmark_runs` row is created. No provider inference,
dataset execution, or scoring occurs.

## Example 3: Review sample benchmark results

Use this example to check sample-data labeling.

1. Open `/bench`.
2. Select the Results tab.
3. Confirm the tab states that records are sample data.
4. Confirm sample percentages and winners are labeled as placeholders.

Expected result: users can inspect the results layout without mistaking sample
records for measured output.

## Example 4: Export an illustrative comparison report

Use this example when validating `/compare`.

1. Open `/compare`.
2. Confirm the dashboard states that metrics are illustrative sample data.
3. Export the report.
4. Confirm the exported report repeats the same sample-data disclosure.

Expected result: exported comparison material does not read as measured model
performance.

## Example 5: Draft a custom test setup

Use this example to check the custom-test builder.

1. Open `/bench`.
2. Select Custom Tests.
3. Draft a test name, prompt, expected output, and criteria.
4. Save the test setup.
5. Select it in the preview runner.

Expected result: the app previews custom test setup only. Provider calls and
scoring are still pending.

## Example 6: Read backend queue data

Use this example when testing the current backend surface.

```ts
import { queueBenchmarkRun } from '@/integrations/supabase/benchmarks';

const run = await queueBenchmarkRun('mmlu', {
  models: ['gpt-4o'],
  config: { source: 'example' },
});

console.log(run.status); // "pending"
console.log(run.message); // scoring not yet implemented
```

Expected result: the helper returns a queued run response from the Supabase edge
function. It does not return benchmark scores.

## Adding future examples

When provider-backed scoring ships, add examples in the same PR as the
implementation and include:

- the provider call path;
- dataset or prompt source;
- scoring method;
- persistence path;
- tests that prove sample data is not mixed with measured output.
