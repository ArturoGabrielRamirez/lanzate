"use server"

import { actionWrapper } from "@/features/global/utils"
import { getStoresFromUserData } from "@/features/stores/data"

export async function getStoresFromUserAction(userId: number) {

    return actionWrapper(async () => {

        const { payload, hasError, message } = await getStoresFromUserData(userId)

        if (hasError) throw new Error(message)

        return {
            message: "Stores fetched successfully",
            payload: payload,
            hasError: false
        }


    })
}
