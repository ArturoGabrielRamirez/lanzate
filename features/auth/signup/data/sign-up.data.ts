'use server';

import { createServerSideClient } from '@/lib/supabase/server';
import type { SignUpParams } from '../types';

export async function signUpWithPasswordData({ email, password }: SignUpParams) {
  const supabase = createServerSideClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  return { data, error };
}

