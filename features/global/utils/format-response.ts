/**
 * Response formatting utilities for Server Actions
 *
 * These utilities provide a consistent way to format success and error
 * responses across all Server Actions, ensuring type safety and
 * predictable response structures.
 */

import {
  ServerError,
  ServerResponse,
  ServerSuccess,
} from "@/features/global/types";

/**
 * Generic response formatter
 *
 * @template T - Type of the payload data
 * @param message - Human-readable message describing the result
 * @param payload - The data to return (null for errors)
 * @param error - Boolean indicating if this is an error response
 * @returns Formatted ServerResponse object
 *
 * @internal This is used internally by formatSuccess and formatError
 */
export function formatResponse<T>(
  message: string,
  payload: T,
  error: boolean
): ServerResponse<T> {
  return {
    message,
    payload,
    hasError: error,
  };
}

/**
 * Format an error response
 *
 * @param message - Error message to return to the client
 * @returns ServerError object with null payload and hasError: true
 *
 * @example
 * ```ts
 * return formatError("User not found");
 * // Returns: { message: "User not found", payload: null, hasError: true }
 * ```
 */
export function formatError(message: string): ServerError {
  return formatResponse(message, null, true) as ServerError;
}

/**
 * Format a success response
 *
 * @template T - Type of the payload data
 * @param message - Success message to return to the client
 * @param payload - Data to return on success
 * @returns ServerSuccess object with payload and hasError: false
 *
 * @example
 * ```ts
 * return formatSuccess("User found", { id: "123", email: "user@example.com" });
 * // Returns: { message: "User found", payload: {...}, hasError: false }
 * ```
 */
export function formatSuccess<T>(
  message: string,
  payload: T
): ServerSuccess<T> {
  return formatResponse<T>(message, payload, false) as ServerSuccess<T>;
}
