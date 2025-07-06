"use server"

import { createSupabaseClient } from "@/utils/supabase/server"
import { getUserByEmail } from "../data/getUserByEmail"
import { formatErrorResponse } from "@/utils/lib"
import { Account, User } from "@/prisma/generated/prisma"

export async function getUserInfo(): Promise<{
    payload: User & { Account: Account[] } | null,
    error: Error | null,
    message: string
}> {
    try {
        const supabase = await createSupabaseClient()
        const { data, error } = await supabase.auth.getUser()

        if (error) {
            throw new Error(error.message)
        }

        const { payload, error: userError, message: userMessage } = await getUserByEmail(data.user.email ?? "")

        if (userError) {
            throw new Error(userMessage)
        }

        return {
            payload: payload,
            error: null,
            message: "User info fetched"
        }
    } catch (error) {
        return formatErrorResponse("Error fetching user info", error)
    }
}