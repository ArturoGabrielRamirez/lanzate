"use server";
import { createServerSideClient } from "@/utils/supabase/server";
import { actionWrapper } from "@/utils/lib";

export async function getCurrentUser() {
  return actionWrapper(async () => {
    const supabase = await createServerSideClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return {
        error: true,
        message: "Usuario no encontrado",
        payload: null
      };
    }
    
    return {
      error: false,
      message: "Usuario actual obtenido exitosamente",
      payload: user
    };
  });
}