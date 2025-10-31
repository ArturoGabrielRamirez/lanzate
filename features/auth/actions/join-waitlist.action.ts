"use server"

import { joinWaitlistData } from "@/features/auth/data"
import { JoinWaitlistFormPayload } from "@/features/auth/types"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"

export async function joinWaitlistAction(formData: JoinWaitlistFormPayload) {
    return actionWrapper(async () => {

        const { hasError, message, payload } = await joinWaitlistData({ email: formData.email })

        if (hasError) throw new Error(message)

        return formatSuccessResponse(message, payload)
    })
}