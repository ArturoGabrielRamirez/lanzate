"use server";

import { createServerSideClient } from "@/utils/supabase/server";

export async function handleEditPassword(currentPassword: string, newPassword: string) {
  const supabase = await createServerSideClient();
  
  // Primero verificar la contraseña actual
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { error: "Usuario no autenticado" };
  }

  // Intentar hacer login con la contraseña actual para validarla
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword
  });

  if (signInError) {
    return { error: "La contraseña actual es incorrecta" };
  }

  // Si la contraseña actual es correcta, actualizar a la nueva
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, data };
}