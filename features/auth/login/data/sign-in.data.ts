'use server';

import { createServerSideClient } from '@/lib/supabase/server';
import type { SignInParams } from '../types';

export async function signInWithPasswordData({ email, password }: SignInParams) {
  const supabase = createServerSideClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}


