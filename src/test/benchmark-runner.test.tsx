import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BenchmarkRunner } from '@/components/bench/BenchmarkRunner';

const { queueBenchmarkRun } = vi.hoisted(() => ({
  queueBenchmarkRun: vi.fn(),
}));

vi.mock('@/integrations/supabase/benchmarks', () => ({
  queueBenchmarkRun,
}));

describe('BenchmarkRunner', () => {
  beforeEach(() => {
    queueBenchmarkRun.mockReset();
  });

  it('queues selected benchmarks through the Supabase edge function client', async () => {
    const user = userEvent.setup();
    queueBenchmarkRun.mockResolvedValue({
      runId: 'run-1',
      status: 'pending',
      message: 'Benchmark queued for processing',
    });

    render(<BenchmarkRunner />);

    await user.click(screen.getByRole('button', { name: /gpt-4o/i }));
    await user.click(screen.getByRole('button', { name: /mmlu/i }));
    await user.click(screen.getByRole('button', { name: /queue benchmark run/i }));

    await waitFor(() => {
      expect(queueBenchmarkRun).toHaveBeenCalledWith('mmlu', {
        models: ['gpt-4o'],
        config: { source: 'BenchmarkRunner' },
      });
    });

    expect(screen.getByText(/^benchmark run queued\.$/i)).toBeInTheDocument();
    expect(screen.getByText(/scoring is not yet available/i)).toBeInTheDocument();
  });

  it('keeps successful queued runs visible when another selected benchmark fails', async () => {
    const user = userEvent.setup();
    queueBenchmarkRun.mockImplementation(async (benchmarkId: string) => {
      if (benchmarkId === 'truthfulqa') {
        throw new Error('Unauthorized');
      }

      return {
        runId: 'run-mmlu',
        status: 'pending',
        message: 'Benchmark queued for processing',
      };
    });

    render(<BenchmarkRunner />);

    await user.click(screen.getByRole('button', { name: /gpt-4o/i }));
    await user.click(screen.getByRole('button', { name: /mmlu/i }));
    await user.click(screen.getByRole('button', { name: /truthfulqa/i }));
    await user.click(screen.getByRole('button', { name: /queue benchmark run/i }));

    await waitFor(() => {
      expect(queueBenchmarkRun).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText(/^benchmark run queued\.$/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName.toLowerCase() === 'li' &&
          element.textContent === 'mmlu: pending for gpt-4o'
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/truthfulqa: unauthorized for gpt-4o/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /queue benchmark run/i }));

    await waitFor(() => {
      expect(queueBenchmarkRun).toHaveBeenCalledTimes(3);
    });

    expect(queueBenchmarkRun).toHaveBeenLastCalledWith('truthfulqa', {
      models: ['gpt-4o'],
      config: { source: 'BenchmarkRunner' },
    });
  });

  it('queues the same benchmark again for a distinct model selection', async () => {
    const user = userEvent.setup();
    queueBenchmarkRun
      .mockResolvedValueOnce({
        runId: 'run-mmlu-gpt4o',
        status: 'pending',
        message: 'Benchmark queued for processing',
      })
      .mockResolvedValueOnce({
        runId: 'run-mmlu-two-models',
        status: 'pending',
        message: 'Benchmark queued for processing',
      });

    render(<BenchmarkRunner />);

    await user.click(screen.getByRole('button', { name: /gpt-4o/i }));
    await user.click(screen.getByRole('button', { name: /mmlu/i }));
    await user.click(screen.getByRole('button', { name: /queue benchmark run/i }));

    await waitFor(() => {
      expect(queueBenchmarkRun).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText(/^benchmark run queued\.$/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName.toLowerCase() === 'li' &&
          element.textContent === 'mmlu: pending for gpt-4o'
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /claude 3\.5 sonnet/i }));
    await user.click(screen.getByRole('button', { name: /queue benchmark run/i }));

    await waitFor(() => {
      expect(queueBenchmarkRun).toHaveBeenCalledTimes(2);
    });

    expect(queueBenchmarkRun).toHaveBeenLastCalledWith('mmlu', {
      models: ['claude-3.5-sonnet', 'gpt-4o'],
      config: { source: 'BenchmarkRunner' },
    });
    expect(screen.getByText(/^benchmark runs queued\.$/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName.toLowerCase() === 'li' &&
          element.textContent === 'mmlu: pending for claude-3.5-sonnet, gpt-4o'
      )
    ).toBeInTheDocument();
  });
});
