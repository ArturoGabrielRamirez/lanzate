import { ActionFunction, ServerResponse } from "@/features/global/types";
import { formatServerResponse } from "@/features/global/utils";

/**
 * Wraps an action function with error handling
 * 
 * @param action - The action function to wrap
 * @returns A promise that resolves to a ServerResponse
 * 
 * @example
 * export const getUserAction = async () => {
 *   return actionWrapper(async () => {
 *     const user = await getUser();
 *     return {
 *       message: "User fetched successfully",
 *       payload: user,
 *       hasError: false
 *     };
 *   });
 * };
 */
export async function actionWrapper<T = unknown>(
    action: ActionFunction<T>
): Promise<ServerResponse<T>> {
    try {
        return await action();
    } catch (error) {
        return formatServerResponse("Action Error", error);
    }
}