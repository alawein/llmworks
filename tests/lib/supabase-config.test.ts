import { describe, it, expect, afterEach, vi } from 'vitest';

describe('Supabase client configuration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('reports missing Supabase configuration without treating placeholders as configured', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { isSupabaseConfigured, getSupabaseConfigurationError, assertSupabaseConfigured } =
      await import('@/integrations/supabase/client');

    expect(isSupabaseConfigured).toBe(false);
    expect(getSupabaseConfigurationError()?.message).toMatch(/VITE_SUPABASE_URL/);
    expect(getSupabaseConfigurationError()?.message).toMatch(/VITE_SUPABASE_PUBLISHABLE_KEY/);
    expect(() => assertSupabaseConfigured()).toThrow(/Supabase is not configured/);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/Supabase is not configured/));
  });

  it('accepts complete Supabase configuration', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'publishable-key');

    const { isSupabaseConfigured, getSupabaseConfigurationError, assertSupabaseConfigured } =
      await import('@/integrations/supabase/client');

    expect(isSupabaseConfigured).toBe(true);
    expect(getSupabaseConfigurationError()).toBeNull();
    expect(() => assertSupabaseConfigured()).not.toThrow();
  });
});
