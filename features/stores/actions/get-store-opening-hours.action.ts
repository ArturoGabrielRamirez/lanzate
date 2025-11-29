"use server"

import { actionWrapper } from "@/features/global/utils"
import { getStoreOpeningHoursData } from "@/features/stores/data/get-store-opening-hours.data"

export async function getStoreOpeningHoursAction(slug: string) {
    return actionWrapper(async () => {
        const data = await getStoreOpeningHoursData(slug)
        return {
            payload: data,
            hasError: false,
            message: "Horarios obtenidos con éxito"
        }
    })
}

