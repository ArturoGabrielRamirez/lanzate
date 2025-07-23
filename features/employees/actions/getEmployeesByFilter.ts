"use server"
import { actionWrapper } from "@/utils/lib"
import { selectUsersByFilter } from "../data/selectUsersByFilter"

export async function getEmployeesByFilter(filter: string, storeId: number) {
    return actionWrapper(async () => {

        const { payload: users, error: usersError, message: usersMessage } = await selectUsersByFilter(filter, storeId)

        if (usersError || !users) throw new Error(usersMessage)

        return {
            message: "Users fetched successfully",
            payload: users,
            error: false
        }
    })
} 