'use server';

import { createServerSideClient } from '@/lib/supabase/server';

export interface SignInParams {
  email: string;
  password: string;
}

export async function signInWithPasswordData({ email, password }: SignInParams) {
  const supabase = createServerSideClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}


