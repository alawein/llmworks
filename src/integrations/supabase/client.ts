// Supabase browser client plus local configuration guards.
// Database table types are generated in ./types.ts; this file owns runtime safety checks.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const missingSupabaseEnvVars = [
  !SUPABASE_URL ? 'VITE_SUPABASE_URL' : null,
  !SUPABASE_PUBLISHABLE_KEY ? 'VITE_SUPABASE_PUBLISHABLE_KEY' : null,
].filter((value): value is string => value !== null);

export const isSupabaseConfigured = missingSupabaseEnvVars.length === 0;

export const getSupabaseConfigurationError = () => {
  if (isSupabaseConfigured) {
    return null;
  }

  return new Error(
    `Supabase is not configured. Set ${missingSupabaseEnvVars.join(
      ' and '
    )}. Supabase-backed auth and benchmark actions are disabled until deployment environment variables are present.`
  );
};

export const assertSupabaseConfigured = () => {
  const error = getSupabaseConfigurationError();
  if (error) {
    throw error;
  }
};

if (!isSupabaseConfigured) {
  console.warn(getSupabaseConfigurationError()?.message);
}

const url = SUPABASE_URL || 'https://placeholder.supabase.co';
const key = SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
