"use server"

import { formatErrorResponse } from "@/utils/lib"
import { getStoresFromUser as getStoresFromUserDb } from "../data/getStoresFromUser"
import { Branch, Store } from "@prisma/client"

type GetStoresFromUserReturn = {
    message: string
    payload: (Store & { branches: Branch[] })[]
    error: boolean
}

export async function getStoresFromUser(userId: number): Promise<GetStoresFromUserReturn> {
    try {

        const { payload, error, message } = await getStoresFromUserDb(userId)

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
