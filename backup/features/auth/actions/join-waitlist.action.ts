"use server"

import { joinWaitlistData } from "@/features/auth/data"
import { JoinWaitlistFormPayload } from "@/features/auth/types"
import { sendWaitlistConfirmation } from "@/features/auth/utils/send-email-wait-list"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"

export async function joinWaitlistAction(formData: JoinWaitlistFormPayload) {
    return actionWrapper(async () => {
        const { hasError, message, payload } = await joinWaitlistData({ email: formData.email })

        if (hasError) {
            console.error("❌ Error en DB:", message)
            throw new Error(message)
        }
        try {
            await sendWaitlistConfirmation(formData.email)
        } catch (emailError) {
            console.error("❌ FALLO AL ENVIAR EMAIL:", emailError)
        }

        return formatSuccessResponse(message, payload)
    })
}