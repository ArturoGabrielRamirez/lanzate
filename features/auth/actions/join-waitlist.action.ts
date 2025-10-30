"use server"

import { JoinWaitlistFormPayload } from "@/features/auth/types"
import { actionWrapper } from "@/features/global/utils"

export async function joinWaitlistAction(formData: JoinWaitlistFormPayload) {
    return actionWrapper(async () => {

        console.log(formData)

        return {
            hasError: false,
            message: "Joined waitlist successfully",
            payload: null
        }
    })
}