import { formatServerResponse } from "@/features/global/utils"
import { Action } from "@/features/global/types"

export function actionWrapper(action: Action) {
    return async () => {
        try {
            return await action()
        } catch (error) {
            return formatServerResponse("Action Error", error)
        }
    }
}