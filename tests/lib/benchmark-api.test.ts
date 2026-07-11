import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const migrationSql = readdirSync(join(repoRoot, 'supabase', 'migrations'))
    .filter((file) => file.endsWith('.sql'))
    .map((file) => readFileSync(join(repoRoot, 'supabase', 'migrations', file), 'utf8'))
    .join('\n');
  const benchmarkMigrationSql = readFileSync(
    join(repoRoot, 'supabase', 'migrations', '20260711000000_benchmark_runs.sql'),
    'utf8'
  );
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
    expect(generatedTypes).toContain('run_id: string;');
    expect(generatedTypes).toContain('score: number | null;');
    expect(generatedTypes).toContain('status: string;');
    expect(generatedTypes).toContain('user_id: string;');
    expect(generatedTypes).toContain("columns: ['run_id', 'user_id', 'benchmark_id'];");
  });

  it('keeps benchmark results bound to their parent benchmark run', () => {
    expect(benchmarkMigrationSql).toMatch(/run_id UUID NOT NULL/i);
    expect(benchmarkMigrationSql).toMatch(
      /FOREIGN KEY \(run_id, user_id, benchmark_id\)\s+REFERENCES public\.benchmark_runs\(id, user_id, benchmark_id\)/i
    );
  });

  it('keeps benchmark writes behind the trusted edge function path', () => {
    expect(benchmarkMigrationSql).toMatch(
      /CREATE POLICY "Users can view their own benchmark runs" ON public\.benchmark_runs\s+FOR SELECT TO authenticated/i
    );
    expect(benchmarkMigrationSql).toMatch(
      /CREATE POLICY "Users can view their own benchmark results" ON public\.benchmark_results\s+FOR SELECT TO authenticated/i
    );
    expect(benchmarkMigrationSql).not.toMatch(/CREATE POLICY .* FOR (INSERT|UPDATE|DELETE)/i);
  });

  it('keeps generated Supabase table types aligned with existing security migrations', () => {
    expect(generatedTypes).toContain('encryption_keys:');
    expect(generatedTypes).toContain('security_audit_log:');
    expect(generatedTypes).toContain('user_roles:');
  });
});
