import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, it, expect, beforeEach, vi } from 'vitest';

const { invokeMock } = vi.hoisted(() => ({
  invokeMock: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: invokeMock,
    },
  },
}));

describe('benchmark edge-function client', () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it('lists benchmarks through the Supabase edge function', async () => {
    const { listBenchmarks } = await import('@/integrations/supabase/benchmarks');
    const benchmarks = [{ id: 'mmlu', name: 'MMLU', description: 'Academic subjects' }];
    invokeMock.mockResolvedValue({ data: benchmarks, error: null });

    await expect(listBenchmarks()).resolves.toEqual(benchmarks);
    expect(invokeMock).toHaveBeenCalledWith('benchmarks', { method: 'GET' });
  });

  it('queues a selected benchmark run through the Supabase edge function', async () => {
    const { queueBenchmarkRun } = await import('@/integrations/supabase/benchmarks');
    invokeMock.mockResolvedValue({
      data: { runId: 'run-1', status: 'pending', message: 'queued' },
      error: null,
    });

    await expect(
      queueBenchmarkRun('mmlu', {
        models: ['gpt-4o'],
        config: { source: 'BenchmarkRunner' },
      })
    ).resolves.toEqual({ runId: 'run-1', status: 'pending', message: 'queued' });

    expect(invokeMock).toHaveBeenCalledWith('benchmarks/mmlu/run', {
      method: 'POST',
      body: {
        models: ['gpt-4o'],
        config: { source: 'BenchmarkRunner' },
      },
    });
  });

  it('reads benchmark results through the Supabase edge function', async () => {
    const { getBenchmarkResults } = await import('@/integrations/supabase/benchmarks');
    const results = [{ id: 'result-1', benchmark_id: 'mmlu', model_id: 'gpt-4o' }];
    invokeMock.mockResolvedValue({ data: results, error: null });

    await expect(getBenchmarkResults('mmlu')).resolves.toEqual(results);
    expect(invokeMock).toHaveBeenCalledWith('benchmarks/mmlu/results', { method: 'GET' });
  });

  it('surfaces Supabase function errors without pretending scoring ran', async () => {
    const { queueBenchmarkRun } = await import('@/integrations/supabase/benchmarks');
    invokeMock.mockResolvedValue({ data: null, error: new Error('Unauthorized') });

    await expect(queueBenchmarkRun('mmlu', { models: ['gpt-4o'] })).rejects.toThrow('Unauthorized');
  });
});

describe('benchmark database schema agreement', () => {
  const repoRoot = process.cwd();
  const migrationSql = readdirSync(join(repoRoot, 'supabase', 'migrations'))
    .filter((file) => file.endsWith('.sql'))
    .map((file) => readFileSync(join(repoRoot, 'supabase', 'migrations', file), 'utf8'))
    .join('\n');
  const generatedTypes = readFileSync(
    join(repoRoot, 'src', 'integrations', 'supabase', 'types.ts'),
    'utf8'
  );

  it('creates the tables used by the benchmarks edge function', () => {
    expect(migrationSql).toMatch(/create table if not exists public\.benchmark_runs/i);
    expect(migrationSql).toMatch(/create table if not exists public\.benchmark_results/i);
  });

  it('keeps generated Supabase table types aligned with benchmark migrations', () => {
    expect(generatedTypes).toContain('benchmark_runs:');
    expect(generatedTypes).toContain('benchmark_results:');
  });

  it('keeps generated Supabase table types aligned with existing security migrations', () => {
    expect(generatedTypes).toContain('encryption_keys:');
    expect(generatedTypes).toContain('security_audit_log:');
    expect(generatedTypes).toContain('user_roles:');
  });
});
