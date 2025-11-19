"use server"

import { revalidatePath } from "next/cache"

import { updateUserAccountData } from "@/features/account/data"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"

export async function updateUserAccountAction(suscriptionId: string, email: string) {
    return actionWrapper(async () => {

        await updateUserAccountData({
            suscriptionId: suscriptionId,
            email: email
        })

        revalidatePath("/account")

        return formatSuccessResponse("User account updated successfully", {
            suscriptionId: suscriptionId
        })
    })
}