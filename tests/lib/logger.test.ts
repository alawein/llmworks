import { afterEach, describe, expect, it, vi } from 'vitest';

import { debugLog } from '@/lib/logger';

describe('debugLog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('routes development diagnostics through console.debug', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);

    debugLog('diagnostic', { source: 'test' });

    expect(debugSpy).toHaveBeenCalledWith('diagnostic', { source: 'test' });
  });
});
