"use server"

import { createSupabaseClient } from "@/utils/supabase/server"

export async function sentNotification() {
    try {
        const supabase = await createSupabaseClient()
        const { data, error } = await supabase.from("notifications").insert({
            message: "Hello, world!",
        })

        if (error) {
            throw new Error(error.message)
        }

        return data

    } catch (error) {
        console.error(error)
    }
}
