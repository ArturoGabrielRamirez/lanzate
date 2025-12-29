/**
 * Type definitions for Server Action response handling
 *
 * These types ensure consistent structure for all Server Actions
 * across the application, providing type safety and predictable
 * error handling patterns.
 */

/**
 * Standard response structure for all Server Actions
 *
 * @template T - The type of the payload data being returned
 * @property message - Human-readable message describing the result
 * @property payload - The data returned on success, null on error
 * @property hasError - Boolean flag indicating if an error occurred
 */
export type ServerResponse<T> = {
  message: string;
  payload: T | null;
  hasError: boolean;
};

/**
 * Type for error responses from Server Actions
 *
 * Extends ServerResponse to ensure payload is always null
 * and hasError is always true for error cases
 */
export type ServerError = ServerResponse<null> & {
  payload: null;
  hasError: true;
};

/**
 * Type for successful responses from Server Actions
 *
 * @template T - The type of the payload data
 * Extends ServerResponse to ensure payload is always present
 * and hasError is always false for success cases
 */
export type ServerSuccess<T> = ServerResponse<T> & {
  payload: T;
  hasError: false;
};

/**
 * Function signature for Server Actions
 *
 * @template T - The type of the payload returned on success
 * All Server Actions should follow this signature to be
 * compatible with the actionWrapper utility
 */
export type ActionFunction<T> = () => Promise<ServerResponse<T>>;
