/**
 * Action wrapper utility for consistent error handling in Server Actions
 *
 * This wrapper provides a centralized error handling mechanism for all
 * Server Actions, ensuring consistent error responses and logging
 * across the application.
 */

import { ActionFunction, ServerResponse } from "@/features/global/types";
import { formatError } from "@/features/global/utils/format-response";

/**
 * Wraps a Server Action with error handling
 *
 * This function wraps any Server Action to provide automatic error handling
 * and consistent error response formatting. All errors are caught, logged,
 * and returned as standardized ServerError responses.
 *
 * @template T - The type of the payload returned on success
 * @param action - The Server Action function to wrap
 * @returns A promise that resolves to a ServerResponse
 *
 * @example
 * ```ts
 * export async function getUserAction() {
 *   return actionWrapper(async () => {
 *     const user = await getUserData();
 *     return formatSuccess("User fetched successfully", user);
 *   });
 * }
 * ```
 */
export async function actionWrapper<T = unknown>(
  action: ActionFunction<T>
): Promise<ServerResponse<T>> {
  try {
    return await action();
  } catch (error) {
    // Log error for debugging
    console.error("🚀 ~ actionWrapper ~ error:", error);

    // Return formatted error response
    if (error instanceof Error) {
      return formatError(error.message);
    }

    // Fallback for unknown error types
    return formatError("An unexpected error occurred");
  }
}
