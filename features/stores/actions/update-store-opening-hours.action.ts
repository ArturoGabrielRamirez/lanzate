"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { updateStoreOpeningHoursData } from "@/features/stores/data/update-store-opening-hours.data"
import { SettingsFormType } from "@/features/stores/schemas"

export async function updateStoreOpeningHoursAction(slug: string, payload: SettingsFormType["settings"]) {
    return actionWrapper(async () => {
        const result = await updateStoreOpeningHoursData(slug, payload)

        revalidatePath(`/stores/${slug}`, "page")

        return {
            payload: result,
            hasError: false,
            message: "Horarios actualizados con éxito"
        }
    })
}

