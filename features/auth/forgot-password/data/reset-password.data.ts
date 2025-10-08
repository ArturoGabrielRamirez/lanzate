'use server';

import { createServerSideClient } from '@/lib/supabase/server';

export async function resetPasswordRequestData(email: string, redirectTo: string) {
  const supabase = createServerSideClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { error };
}


