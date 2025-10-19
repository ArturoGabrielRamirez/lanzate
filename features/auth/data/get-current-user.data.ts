"use server"

import { createServerSideClient } from "@/utils/supabase/server";

export async function getCurrentUserData() {
    
    const supabase = createServerSideClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw new Error(error.message)

    if (!user) throw new Error("Usuario no encontrado")

    return {
        user,
        error: false,
        message: "Usuario encontrado"
    }
}