"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { actionWrapper } from "@/utils/lib";

export async function handleEditPassword(currentPassword: string, newPassword: string) {
  return actionWrapper(async () => {
    const supabase = await createServerSideClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: true,
        message: "Usuario no autenticado",
        payload: null
      };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      return {
        error: true,
        message: "La contraseña actual es incorrecta",
        payload: null
      };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return {
        error: true,
        message: error?.message || "Error al actualizar la contraseña",
        payload: null
      };
    }

    return {
      error: false,
      message: "Contraseña actualizada exitosamente",
      payload: data
    };
  });
}