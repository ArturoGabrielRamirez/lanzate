"use server"

import { createServerSideClient } from "@/utils/supabase/server"

export async function getUserData() {
    const supabase = createServerSideClient()
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()

    if (error || !supabaseUser) {
        return {
            hasError: true,
            message: "Usuario no autenticado",
            payload: null
        }
    } else {
        return {
            hasError: false,
            message: "Usuario obtenido exitosamente",
            payload: supabaseUser
        }
    }

}