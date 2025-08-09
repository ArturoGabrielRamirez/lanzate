"use server";

import { createServerSideClient } from "@/utils/supabase/server";

export async function getCurrentUser() {

  const supabase = await createServerSideClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error: "User not found" };
  }

  return { user, error: null };
}