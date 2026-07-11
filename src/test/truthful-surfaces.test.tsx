import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DebateMode } from '@/components/arena/DebateMode';
import { ModelComparisonDashboard } from '@/components/comparison/ModelComparisonDashboard';

vi.mock('@/components/comparison/RadarComparisonChart', () => ({
  RadarComparisonChart: () => <div data-testid="radar-chart" />,
}));

vi.mock('@/components/comparison/BarComparisonChart', () => ({
  BarComparisonChart: () => <div data-testid="bar-chart" />,
}));

describe('truthful demo surfaces', () => {
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
});
