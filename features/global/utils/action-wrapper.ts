import { ActionFunction, ServerResponse } from "@/features/global/types";
import { formatErrorResponse } from "@/features/global/utils";

export async function actionWrapper<T = unknown>(
    action: ActionFunction<T>
): Promise<ServerResponse<T>> {
    try {
        return await action();
    } catch (error) {
        if (error instanceof Error) {
            return formatErrorResponse(error.message);
        }
        return formatErrorResponse("Action Error");
    }
}