import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { DebateMode } from '@/components/arena/DebateMode';
import { ModelComparisonDashboard } from '@/components/comparison/ModelComparisonDashboard';
import { CostTrackingDashboard } from '@/components/dashboard/CostTrackingDashboard';
import Arena from '@/pages/Arena';
import Bench from '@/pages/Bench';
import Index from '@/pages/Index';

vi.mock('@/components/comparison/RadarComparisonChart', () => ({
  RadarComparisonChart: () => <div data-testid="radar-chart" />,
}));

vi.mock('@/components/comparison/BarComparisonChart', () => ({
  BarComparisonChart: () => <div data-testid="bar-chart" />,
}));

vi.mock('@/components/ShowcaseDemo', () => ({
  ShowcaseDemo: () => <div data-testid="showcase-demo" />,
}));

vi.mock('@/components/bench/BenchmarkRunner', () => ({
  BenchmarkRunner: () => null,
}));

vi.mock('@/components/bench/CustomTestBuilder', () => ({
  CustomTestBuilder: () => null,
}));

vi.mock('@/components/bench/ResultsViewer', () => ({
  ResultsViewer: () => null,
}));

describe('truthful demo surfaces', () => {
  it('keeps the landing page honest about scripted demos and unfinished scoring', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.getByText(/scripted demos and sample metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/benchmark scoring is not yet implemented/i)).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(
      /auditable results|real-time evaluations|cryptographic verification|rigorous benchmarking/i
    );
  });

  it('keeps the scripted-demo disclosure visible for every arena mode', () => {
    render(
      <MemoryRouter>
        <Arena />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/all arena modes are scripted demos.*no provider calls/i)
    ).toBeInTheDocument();
  });

  it('keeps the bench page honest about queued runs and unfinished scoring', () => {
    render(
      <MemoryRouter>
        <Bench />
      </MemoryRouter>
    );

    expect(screen.getByText(/queue benchmark run records/i)).toBeInTheDocument();
    expect(screen.getByText(/provider-backed scoring is not yet implemented/i)).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(
      /automated scoring|auditable reports|performance analysis and audit trails/i
    );
  });

  it('labels the scripted debate as a demo before a user starts it', () => {
    render(<DebateMode />);

    expect(
      screen.getByText(/scripted demo.*no provider calls or verified citations/i)
    ).toBeInTheDocument();
  });

  it('labels the comparison dashboard and its exported report as illustrative sample data', async () => {
    const user = userEvent.setup();
    const reportDocument = {
      close: vi.fn(),
      write: vi.fn(),
    };
    const reportWindow = {
      close: vi.fn(),
      document: reportDocument,
      focus: vi.fn(),
      print: vi.fn(),
    };
    vi.spyOn(window, 'open').mockReturnValue(reportWindow as unknown as Window);

    render(<ModelComparisonDashboard />);

    expect(screen.getByText(/illustrative sample data.*not measured results/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /export pdf/i }));

    expect(reportDocument.write).toHaveBeenCalledWith(
      expect.stringMatching(/illustrative sample data.*not measured results/i)
    );
  });

  it('labels cost tracking numbers as illustrative sample data', () => {
    render(<CostTrackingDashboard />);

    expect(screen.getByText(/sample cost dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByText(/illustrative sample spend.*not measured billing data/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/sample total spent/i)).toBeInTheDocument();
    expect(screen.getByText(/sample model usage & costs/i)).toBeInTheDocument();
    expect(screen.getByText(/sample cost optimization recommendations/i)).toBeInTheDocument();
  });

  it('does not present sample cost controls as live actions', () => {
    render(<CostTrackingDashboard />);

    expect(screen.getByRole('button', { name: /^export sample$/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /sample budget settings/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^refresh sample$/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^export sample details$/i })).toBeDisabled();
  });
});
