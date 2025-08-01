"use server"

import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper } from "@/utils/lib"

export async function checkStorageBucket() {
    return actionWrapper(async () => {
        const supabase = createServerSideClient()

        try {
            // Intentar listar archivos del bucket para verificar si existe
            const { data, error } = await supabase.storage
                .from("contracts")
                .list("", {
                    limit: 1
                })

            if (error) {
                // Si el error es que el bucket no existe, lo creamos
                if (error.message.includes("not found") || error.message.includes("does not exist")) {
                    console.log("Bucket 'contracts' no existe, necesitas crearlo en Supabase")
                    return {
                        error: true,
                        message: "Bucket 'contracts' no existe en Supabase Storage. Por favor, créalo manualmente.",
                        payload: null
                    }
                }
                throw error
            }

            return {
                error: false,
                message: "Bucket 'contracts' existe",
                payload: data
            }

        } catch (error) {
            console.error("Error checking storage bucket:", error)
            return {
                error: true,
                message: error instanceof Error ? error.message : "Error checking storage bucket",
                payload: null
            }
        }
    })
} 