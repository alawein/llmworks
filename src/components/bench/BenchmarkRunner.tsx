import { Badge, Button, Card, Checkbox, Progress } from '@alawein/ui';
import { useState } from 'react';

import { queueBenchmarkRun, type BenchmarkRunResponse } from '@/integrations/supabase/benchmarks';

import {
  Play,
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Download,
} from 'lucide-react';

interface BenchmarkResult {
  model: string;
  accuracy: number;
  brierScore: number;
  citationQuality: number;
  avgTime: number;
  eloRating: number;
}

interface BenchmarkProgress {
  current: number;
  total: number;
  currentTask: string;
  model: string;
}

interface QueuedBenchmarkRun extends BenchmarkRunResponse {
  benchmarkId: string;
  queueKey: string;
  models: string[];
  config: Record<string, unknown>;
}

interface BenchmarkQueueFailure {
  benchmarkId: string;
  queueKey: string;
  models: string[];
  message: string;
}

const benchmarkRunnerConfig: Record<string, unknown> = { source: 'BenchmarkRunner' };

const normalizeModelIds = (modelIds: string[]) =>
  [...modelIds].sort((first, second) => first.localeCompare(second));

const createBenchmarkQueueKey = (
  benchmarkId: string,
  modelIds: string[],
  config: Record<string, unknown>
) =>
  JSON.stringify({
    benchmarkId,
    models: normalizeModelIds(modelIds),
    config,
  });

const formatModelIds = (modelIds: string[]) => modelIds.join(', ');

export const BenchmarkRunner = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<BenchmarkProgress | null>(null);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [queuedRuns, setQueuedRuns] = useState<QueuedBenchmarkRun[]>([]);
  const [queueFailures, setQueueFailures] = useState<BenchmarkQueueFailure[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [scoringNotImplemented, setScoringNotImplemented] = useState(false);

  const models = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
    { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta' },
  ];

  const benchmarks = [
    {
      id: 'mmlu',
      name: 'MMLU',
      description: '57 academic subjects',
      tasks: 15459,
      estimatedTime: '45 min',
      difficulty: 'Advanced',
    },
    {
      id: 'truthfulqa',
      name: 'TruthfulQA',
      description: 'Truthfulness evaluation',
      tasks: 817,
      estimatedTime: '20 min',
      difficulty: 'Expert',
    },
    {
      id: 'gsm8k',
      name: 'GSM8K',
      description: 'Grade school math',
      tasks: 1319,
      estimatedTime: '30 min',
      difficulty: 'Intermediate',
    },
  ];

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  const toggleBenchmarkSelection = (benchmarkId: string) => {
    setSelectedBenchmarks((prev) =>
      prev.includes(benchmarkId) ? prev.filter((id) => id !== benchmarkId) : [...prev, benchmarkId]
    );
  };

  const startBenchmark = async () => {
    if (selectedModels.length === 0 || selectedBenchmarks.length === 0) return;

    setIsRunning(true);
    setResults([]);
    setQueueFailures([]);
    setShowResults(false);
    setScoringNotImplemented(false);

    const modelsToQueue = normalizeModelIds(selectedModels);
    const queueRequests = selectedBenchmarks.map((benchmarkId) => ({
      benchmarkId,
      queueKey: createBenchmarkQueueKey(benchmarkId, modelsToQueue, benchmarkRunnerConfig),
      models: modelsToQueue,
      config: benchmarkRunnerConfig,
    }));
    const queuedRunKeys = new Set(queuedRuns.map((run) => run.queueKey));
    const requestsToQueue = queueRequests.filter(
      (request) => !queuedRunKeys.has(request.queueKey)
    );

    if (requestsToQueue.length === 0) {
      setIsRunning(false);
      setProgress(null);
      setScoringNotImplemented(true);
      return;
    }

    const queueResults = await Promise.allSettled(
      requestsToQueue.map(async (request) => {
        try {
          const run = await queueBenchmarkRun(request.benchmarkId, {
            models: request.models,
            config: request.config,
          });
          return { ...request, ...run };
        } catch (error) {
          throw {
            benchmarkId: request.benchmarkId,
            queueKey: request.queueKey,
            models: request.models,
            message: error instanceof Error ? error.message : 'Unable to queue benchmark run',
          };
        }
      })
    );

    const queued = queueResults.flatMap((result) =>
      result.status === 'fulfilled' ? [result.value] : []
    );
    const failures = queueResults.flatMap((result) =>
      result.status === 'rejected' ? [result.reason as BenchmarkQueueFailure] : []
    );

    setQueuedRuns((previousRuns) => {
      const byQueueKey = new Map(previousRuns.map((run) => [run.queueKey, run]));
      queued.forEach((run) => byQueueKey.set(run.queueKey, run));
      return Array.from(byQueueKey.values());
    });
    setQueueFailures(failures);
    // TODO: Real benchmark scoring requires calling each model's inference API
    // and evaluating output against ground truth datasets. This is not yet implemented.
    // See: docs/superpowers/specs/2026-04-25-active-product-integrity-design.md L1
    setScoringNotImplemented(queued.length > 0 || queuedRuns.length > 0);
    setIsRunning(false);
    setProgress(null);
  };

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      benchmarks: selectedBenchmarks,
      results: results,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-results-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Model Selection */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Select Models</h3>
          </div>

          <div className="space-y-3">
            {models.map((model) => (
              <div key={model.id} className="flex items-center space-x-2">
                <Checkbox
                  id={model.id}
                  checked={selectedModels.includes(model.id)}
                  onCheckedChange={() => toggleModelSelection(model.id)}
                />
                <button
                  type="button"
                  className="flex-1 cursor-pointer text-left"
                  onClick={() => toggleModelSelection(model.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{model.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {model.provider}
                    </Badge>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Benchmark Selection */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-bold text-foreground">Select Benchmarks</h3>
          </div>

          <div className="space-y-3">
            {benchmarks.map((benchmark) => (
              <div key={benchmark.id} className="flex items-center space-x-2">
                <Checkbox
                  id={benchmark.id}
                  checked={selectedBenchmarks.includes(benchmark.id)}
                  onCheckedChange={() => toggleBenchmarkSelection(benchmark.id)}
                />
                <button
                  type="button"
                  className="flex-1 cursor-pointer text-left"
                  onClick={() => toggleBenchmarkSelection(benchmark.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{benchmark.name}</span>
                      <Badge
                        className={
                          benchmark.difficulty === 'Expert'
                            ? 'bg-accent/10 text-accent'
                            : benchmark.difficulty === 'Advanced'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                        }
                      >
                        {benchmark.difficulty}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {benchmark.description} • {benchmark.tasks.toLocaleString()} tasks •{' '}
                      {benchmark.estimatedTime}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="p-6 gradient-surface">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Benchmark Execution</h3>
            <p className="text-sm text-muted-foreground">
              {selectedModels.length} model(s) × {selectedBenchmarks.length} benchmark(s) selected
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={startBenchmark}
              disabled={selectedModels.length === 0 || selectedBenchmarks.length === 0 || isRunning}
              variant="hero"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Start Benchmark'}
            </Button>
            {showResults && (
              <Button onClick={exportResults} variant="outline">
                <Download className="h-4 w-4" />
                Export Results
              </Button>
            )}
          </div>
        </div>

        {/* Progress Display */}
        {progress && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">
                {progress.model} • {progress.currentTask}
              </span>
              <span className="text-muted-foreground">
                {progress.current.toLocaleString()} / {progress.total.toLocaleString()} tasks
              </span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} className="h-2" />
          </div>
        )}
      </Card>

      {/* Queue status */}
      {queuedRuns.length > 0 && (
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-3 text-primary opacity-70" />
            <p className="font-medium text-foreground">
              {queuedRuns.length === 1 ? 'Benchmark run queued.' : 'Benchmark runs queued.'}
            </p>
            <p className="text-sm mt-2">
              {queuedRuns.length} benchmark run{queuedRuns.length === 1 ? '' : 's'} queued.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {queuedRuns.map((run) => (
                <li key={run.queueKey}>
                  <span className="font-medium text-foreground">{run.benchmarkId}</span>:{' '}
                  {run.status} for {formatModelIds(run.models)}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Queue error */}
      {queueFailures.length > 0 && (
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-destructive opacity-70" />
            <p className="font-medium text-foreground">
              Some benchmark runs could not be queued.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {queueFailures.map((failure) => (
                <li key={failure.queueKey}>
                  {failure.benchmarkId}: {failure.message} for {formatModelIds(failure.models)}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Not-implemented state */}
      {scoringNotImplemented && (
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-accent opacity-60" />
            <p className="font-medium text-foreground">Benchmark scoring is not yet available.</p>
            <p className="text-sm mt-2">
              Real model evaluations require inference API integration. Results shown here would be
              placeholder data — they are withheld until real scoring is implemented.
            </p>
          </div>
        </Card>
      )}

      {/* Results Display */}
      {showResults && results.length > 0 && (
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Benchmark Results</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-sm font-medium text-muted-foreground">
                      Rank
                    </th>
                    <th className="text-left py-2 text-sm font-medium text-muted-foreground">
                      Model
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Accuracy
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Brier Score
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Citation Quality
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Avg Time (ms)
                    </th>
                    <th className="text-center py-2 text-sm font-medium text-muted-foreground">
                      Elo Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.model} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {index === 0 && <CheckCircle className="h-4 w-4 text-accent" />}
                          <span className="font-medium text-foreground">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-foreground">{result.model}</span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge className="bg-primary/10 text-primary">
                          {(result.accuracy * 100).toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-foreground">{result.brierScore.toFixed(3)}</span>
                      </td>
                      <td className="py-3 text-center">
                        <Badge className="bg-accent/10 text-accent">
                          {(result.citationQuality * 100).toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-muted-foreground">{Math.round(result.avgTime)}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="font-medium text-foreground">
                          {Math.round(result.eloRating)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Performance Insights */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-foreground">Performance Insights</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Key Findings</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    • {results[0]?.model} achieved highest accuracy at{' '}
                    {(results[0]?.accuracy * 100).toFixed(1)}%
                  </p>
                  <p>
                    • Average citation quality across models:{' '}
                    {(
                      (results.reduce((sum, r) => sum + r.citationQuality, 0) / results.length) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  <p>• Fastest model: {results.sort((a, b) => a.avgTime - b.avgTime)[0]?.model}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Recommendations</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Consider model ensemble for optimal performance</p>
                  <p>• Monitor citation quality for factual accuracy</p>
                  <p>• Track performance trends over time</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
