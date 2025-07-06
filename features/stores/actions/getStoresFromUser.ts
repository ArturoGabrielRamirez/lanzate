"use server"

import { formatErrorResponse } from "@/utils/lib"
import { getStoresFromUser as getStoresFromUserDb } from "../data/getStoresFromUser"
import { Store } from "@/prisma/generated/prisma"

type GetStoresFromUserReturn = {
    message: string
    payload: Store[]
    error: boolean
}

export async function getStoresFromUser(): Promise<GetStoresFromUserReturn> {
    try {

        const { payload, error, message } = await getStoresFromUserDb(1)

        if (error) throw new Error(message)

        return {
            message: "Stores fetched successfully",
            payload: payload,
            error: false
        }


    } catch (error) {
        return formatErrorResponse("Error fetching stores", error, [])
    }
}
