"use server"

import { formatSuccessResponse } from "@/features/global/utils"
import { createServerSideClient } from "@/utils/supabase/server"

export async function checkStorageBucketData() {
    const supabase = createServerSideClient()

    const { data, error } = await supabase.storage
        .from("contracts")
        .list("", {
            limit: 1
        })

    if (error) {
        if (error.message.includes("not found") || error.message.includes("does not exist")) {
            throw new Error("Bucket 'contracts' no existe en Supabase Storage. Por favor, créalo manualmente.")
        }
        throw error
    }

    return formatSuccessResponse("Bucket 'contracts' existe", data)

} 