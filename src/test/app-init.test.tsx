import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const {
  initAdvancedSEOMock,
  initMonitoringMock,
  initPerformanceMonitoringMock,
  initSecurityMock,
  initSmoothScrollMock,
  registerSWMock,
} = vi.hoisted(() => ({
  initAdvancedSEOMock: vi.fn(),
  initMonitoringMock: vi.fn(),
  initPerformanceMonitoringMock: vi.fn(),
  initSecurityMock: vi.fn(),
  initSmoothScrollMock: vi.fn(),
  registerSWMock: vi.fn(),
}));

vi.mock('@/lib/advanced-seo', () => ({
  initAdvancedSEO: initAdvancedSEOMock,
}));

vi.mock('@/lib/monitoring', () => ({
  initMonitoring: initMonitoringMock,
}));

vi.mock('@/lib/performance', () => ({
  initPerformanceMonitoring: initPerformanceMonitoringMock,
}));

vi.mock('@/lib/security', () => ({
  initSecurity: initSecurityMock,
}));

vi.mock('@/lib/service-worker', () => ({
  registerSW: registerSWMock,
}));

vi.mock('@/lib/smooth-scroll', () => ({
  initSmoothScroll: initSmoothScrollMock,
}));

import App from '@/App';

describe('App production initialization', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('wires the security, SEO, and monitoring init modules on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(initSecurityMock).toHaveBeenCalledTimes(1);
    });

    expect(initAdvancedSEOMock).toHaveBeenCalledTimes(1);
    expect(initMonitoringMock).toHaveBeenCalledTimes(1);
    expect(initSmoothScrollMock).toHaveBeenCalledTimes(1);
    expect(initPerformanceMonitoringMock).toHaveBeenCalledWith({
      trackCoreWebVitals: true,
      trackNavigation: true,
      debug: true,
    });
    expect(registerSWMock).toHaveBeenCalledTimes(1);
  });
});
