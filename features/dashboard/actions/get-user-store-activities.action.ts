"use server"

import { selectUserStoreActivitiesData } from "@/features/dashboard/data"
import { actionWrapper } from "@/features/global/utils"

export async function getUserStoreActivitiesAction(userId: number, type: string, page: number) {
    return actionWrapper(async () => {

        if (!userId) {
            throw new Error("El ID del usuario es requerido")
        }

        const { payload } = await selectUserStoreActivitiesData(userId, type, page)

        return {
            message: "Las actividades de la tienda del usuario se obtuvieron con éxito",
            payload: payload,
            hasError: false
        }
    })
} 