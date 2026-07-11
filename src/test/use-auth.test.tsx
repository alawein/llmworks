import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/hooks/useAuth';

const { authMock, getSupabaseConfigurationErrorMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  getSupabaseConfigurationErrorMock: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  getSupabaseConfigurationError: getSupabaseConfigurationErrorMock,
  supabase: {
    auth: authMock,
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    getSupabaseConfigurationErrorMock.mockReset();
    authMock.getSession.mockReset();
    authMock.onAuthStateChange.mockReset();
    authMock.signInWithPassword.mockReset();
    authMock.signUp.mockReset();
    authMock.signOut.mockReset();
    authMock.resetPasswordForEmail.mockReset();
    authMock.updateUser.mockReset();

    getSupabaseConfigurationErrorMock.mockReturnValue(null);
    authMock.getSession.mockResolvedValue({ data: { session: null } });
    authMock.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('does not call Supabase auth endpoints when configuration is missing', async () => {
    getSupabaseConfigurationErrorMock.mockReturnValue(
      new Error(
        'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
      )
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(authMock.getSession).not.toHaveBeenCalled();
    expect(authMock.onAuthStateChange).not.toHaveBeenCalled();

    await expect(result.current.signIn('user@example.com', 'password')).resolves.toMatchObject({
      data: null,
      error: expect.any(Error),
    });
    expect(authMock.signInWithPassword).not.toHaveBeenCalled();
  });
});
