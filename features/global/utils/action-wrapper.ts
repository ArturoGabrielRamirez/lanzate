/**
 * Action wrapper utility for consistent error handling in Server Actions
 *
 * This wrapper provides a centralized error handling mechanism for all
 * Server Actions, ensuring consistent error responses and logging
 * across the application.
 */

import { ActionFunction, ServerResponse } from "@/features/global/types";
import { formatError } from "@/features/global/utils/format-response";
import { ValidationError } from "yup";
import { Prisma } from "@prisma/client";

/**
 * Wraps a Server Action with error handling
 *
 * This function wraps any Server Action to provide automatic error handling
 * and consistent error response formatting. All errors are caught, logged,
 * and returned as standardized ServerError responses.
 *
 * Handles the following error types:
 * - Yup ValidationError: Returns first validation error message
 * - Prisma PrismaClientKnownRequestError: Converts database errors to user-friendly messages
 * - Generic Error: Returns error message
 * - Unknown: Returns generic fallback message
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

    // Handle Yup validation errors
    if (error instanceof ValidationError) {
      return formatError(error.errors[0] || "Validation failed");
    }

    // Handle Prisma database errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return formatError(normalizePrismaError(error));
    }

    // Handle generic Prisma errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      return formatError("Invalid data provided");
    }

    // Return formatted error response for generic errors
    if (error instanceof Error) {
      return formatError(error.message);
    }

    // Fallback for unknown error types
    return formatError("An unexpected error occurred");
  }
}

/**
 * Normalizes Prisma error codes to user-friendly messages
 *
 * @param error - Prisma error to normalize
 * @returns User-friendly error message
 *
 * @internal
 */
function normalizePrismaError(
  error: Prisma.PrismaClientKnownRequestError
): string {
  switch (error.code) {
    case "P2002": {
      // Unique constraint violation
      const target = error.meta?.target as string[] | undefined;
      const field = target?.[0] || "field";
      return `A record with this ${field} already exists`;
    }
    case "P2025":
      // Record not found
      return "Record not found";
    case "P2003":
      // Foreign key constraint violation
      return "Cannot delete or update record due to related data";
    case "P2014":
      // Required relation violation
      return "Required field is missing";
    case "P2000":
      // Value too long
      return "Value is too long for the field";
    case "P2001":
      // Record does not exist
      return "Related record does not exist";
    default:
      // Generic database error
      return "Database operation failed";
  }
}
