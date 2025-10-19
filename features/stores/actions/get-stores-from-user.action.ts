"use server"

import { actionWrapper } from "@/features/global/utils"
import { getStoresFromUser as getStoresFromUserDb } from "@/features/stores/data/getStoresFromUser"

export async function getStoresFromUserAction(userId: number){

    return actionWrapper(async () => {

        const { payload, error, message } = await getStoresFromUserDb(userId)

        if (error) throw new Error(message)

        return {
            message: "Stores fetched successfully",
            payload: payload,
            hasError: false
        }


    })
}
