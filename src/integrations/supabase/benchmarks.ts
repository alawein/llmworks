import { assertSupabaseConfigured, supabase } from './client';

export interface BenchmarkDefinition {
  id: string;
  name: string;
  description: string;
  categories?: number;
}

export interface BenchmarkRunRequest {
  models: string[];
  config?: Record<string, unknown>;
}

export interface BenchmarkRunResponse {
  runId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  message: string;
}

export interface BenchmarkResult {
  id: string;
  benchmark_id: string;
  model_id: string;
  run_id: string;
  user_id: string;
  metrics: Record<string, unknown>;
  output: Record<string, unknown> | null;
  score: number | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}

const raiseIfFunctionError = (error: unknown) => {
  if (!error) return;
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(String(error));
};

export const listBenchmarks = async () => {
  assertSupabaseConfigured();

  const { data, error } = await supabase.functions.invoke<BenchmarkDefinition[]>('benchmarks', {
    method: 'GET',
  });

  raiseIfFunctionError(error);
  return data ?? [];
};

export const getBenchmarkResults = async (benchmarkId: string) => {
  assertSupabaseConfigured();

  const { data, error } = await supabase.functions.invoke<BenchmarkResult[]>(
    `benchmarks/${encodeURIComponent(benchmarkId)}/results`,
    { method: 'GET' }
  );

  raiseIfFunctionError(error);
  return data ?? [];
};

export const queueBenchmarkRun = async (benchmarkId: string, request: BenchmarkRunRequest) => {
  assertSupabaseConfigured();

  const { data, error } = await supabase.functions.invoke<BenchmarkRunResponse>(
    `benchmarks/${encodeURIComponent(benchmarkId)}/run`,
    {
      method: 'POST',
      body: {
        models: request.models,
        config: request.config ?? {},
      },
    }
  );

  raiseIfFunctionError(error);
  if (!data) {
    throw new Error('Benchmark run did not return a response');
  }

  return data;
};
