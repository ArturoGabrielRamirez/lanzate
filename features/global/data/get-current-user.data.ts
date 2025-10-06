'use server';

import { createServerSideClient } from '@/lib/supabase/server';

export async function getCurrentUserData() {
  const supabase = createServerSideClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  return { user, error };
}

