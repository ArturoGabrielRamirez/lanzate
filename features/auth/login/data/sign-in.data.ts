'use server';

import type { SignInParams } from '@/features/auth/login/types';
import { createServerSideClient } from '@/lib/supabase/server';

export async function signInWithPasswordData({ email, password }: SignInParams) {
  const supabase = createServerSideClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}


