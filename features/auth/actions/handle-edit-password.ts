"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./get-user";

export async function handleEditPassword(password: string) {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { error: userError || "User not found" };
  }

  const supabase = await createServerSideClient();
  const { data, error } = await supabase.auth.admin.updateUserById(
    user.id,
    { password: password }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}