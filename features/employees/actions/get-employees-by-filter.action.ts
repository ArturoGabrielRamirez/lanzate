"use server"

import { selectUsersByFilter } from "@/features/employees/data/select-users-by-filter.data"
import { actionWrapper } from "@/utils/lib"

export async function getEmployeesByFilterAction(filter: string, storeId: number, userId: number) {
    return actionWrapper(async () => {

        const { payload: users, error: usersError, message: usersMessage } = await selectUsersByFilter(filter, storeId, userId)

        if (usersError || !users) throw new Error(usersMessage)

        return {
            message: "Users fetched successfully",
            payload: users,
            error: false
        }
    })
} 