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
    await user.click(screen.getByRole('button', { name: /start benchmark/i }));

    await waitFor(() => {
      expect(queueBenchmarkRun).toHaveBeenCalledWith('mmlu', {
        models: ['gpt-4o'],
        config: { source: 'BenchmarkRunner' },
      });
    });

    expect(screen.getByText(/^benchmark run queued\.$/i)).toBeInTheDocument();
    expect(screen.getByText(/scoring is not yet available/i)).toBeInTheDocument();
  });
});
