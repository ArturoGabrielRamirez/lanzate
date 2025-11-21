"use server"

import { selectUsersByFilterData } from "@/features/employees/data/select-users-by-filter.data"
import { actionWrapper } from "@/features/global/utils"

export async function getEmployeesByFilterAction(filter: string, storeId: number, userId: number) {
    return actionWrapper(async () => {

        const { payload: users, hasError: usersError, message: usersMessage } = await selectUsersByFilterData(filter, storeId, userId)

        if (usersError || !users) throw new Error(usersMessage)

        return {
            message: "Usuarios obtenidos con éxito",
            payload: users,
            hasError: false
        }
    })
} 