-- Add the benchmark tables used by supabase/functions/benchmarks.
-- Benchmark execution is queued here; scoring remains unimplemented until
-- model inference and benchmark dataset workers are wired.

CREATE TABLE IF NOT EXISTS public.benchmark_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  benchmark_id TEXT NOT NULL,
  models JSONB NOT NULL DEFAULT '[]'::jsonb,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'running', 'completed', 'failed', 'cancelled')
  ),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.benchmark_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.benchmark_runs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  benchmark_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB,
  score NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'running', 'completed', 'failed', 'cancelled')
  ),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.benchmark_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own benchmark runs" ON public.benchmark_runs;
DROP POLICY IF EXISTS "Users can create their own benchmark runs" ON public.benchmark_runs;
DROP POLICY IF EXISTS "Users can update their own benchmark runs" ON public.benchmark_runs;
DROP POLICY IF EXISTS "Users can delete their own benchmark runs" ON public.benchmark_runs;

CREATE POLICY "Users can view their own benchmark runs" ON public.benchmark_runs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own benchmark runs" ON public.benchmark_runs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own benchmark runs" ON public.benchmark_runs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own benchmark runs" ON public.benchmark_runs
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own benchmark results" ON public.benchmark_results;
DROP POLICY IF EXISTS "Users can create their own benchmark results" ON public.benchmark_results;
DROP POLICY IF EXISTS "Users can update their own benchmark results" ON public.benchmark_results;
DROP POLICY IF EXISTS "Users can delete their own benchmark results" ON public.benchmark_results;

CREATE POLICY "Users can view their own benchmark results" ON public.benchmark_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own benchmark results" ON public.benchmark_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own benchmark results" ON public.benchmark_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own benchmark results" ON public.benchmark_results
  FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_benchmark_runs_updated_at ON public.benchmark_runs;
CREATE TRIGGER update_benchmark_runs_updated_at
  BEFORE UPDATE ON public.benchmark_runs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_benchmark_runs_user_id ON public.benchmark_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_benchmark_runs_benchmark_id ON public.benchmark_runs(benchmark_id);
CREATE INDEX IF NOT EXISTS idx_benchmark_runs_status ON public.benchmark_runs(status);
CREATE INDEX IF NOT EXISTS idx_benchmark_runs_created_at ON public.benchmark_runs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_benchmark_results_run_id ON public.benchmark_results(run_id);
CREATE INDEX IF NOT EXISTS idx_benchmark_results_user_id ON public.benchmark_results(user_id);
CREATE INDEX IF NOT EXISTS idx_benchmark_results_benchmark_id ON public.benchmark_results(benchmark_id);
CREATE INDEX IF NOT EXISTS idx_benchmark_results_created_at ON public.benchmark_results(created_at DESC);

COMMENT ON TABLE public.benchmark_runs IS 'Queued benchmark execution requests created by the benchmarks edge function';
COMMENT ON TABLE public.benchmark_results IS 'Per-model benchmark outputs and metrics produced by future benchmark workers';
