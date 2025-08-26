"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { actionWrapper } from "@/utils/lib";

export async function handleEditPassword(currentPassword: string, newPassword: string) {
  return actionWrapper(async () => {
    const supabase = await createServerSideClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Usuario no autenticado");
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      throw new Error("La contraseña actual es incorrecta");
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      error: false,
      message: "Contraseña actualizada exitosamente",
      payload: data
    };
  });
}