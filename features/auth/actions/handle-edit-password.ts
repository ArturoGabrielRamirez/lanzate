"use server";

import { createServerSideClient } from "@/utils/supabase/server";

export async function handleEditPassword(currentPassword: string, newPassword: string) {
  const supabase = await createServerSideClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword
  });

  if (signInError) {
    return { error: "La contraseña actual es incorrecta" };
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}