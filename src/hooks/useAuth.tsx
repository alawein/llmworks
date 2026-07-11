import { useState, useEffect } from 'react';
import { getSupabaseConfigurationError, supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type AuthMetadata = Record<string, unknown>;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) {
      return { data: null, error: configurationError };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, metadata?: AuthMetadata) => {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) {
      return { data: null, error: configurationError };
    }

    // Get the current URL for proper redirect after email confirmation
    const redirectUrl = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: redirectUrl, // SECURITY FIX: Added email redirect configuration
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) {
      return { error: configurationError };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) {
      return { data: null, error: configurationError };
    }

    const redirectUrl = `${window.location.origin}/auth/reset-password`;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { data, error };
  };

  const updatePassword = async (newPassword: string) => {
    const configurationError = getSupabaseConfigurationError();
    if (configurationError) {
      return { data: null, error: configurationError };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
}
