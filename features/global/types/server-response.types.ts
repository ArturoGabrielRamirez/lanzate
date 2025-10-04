/**
 * Represents a successful server response with a payload
 */
export interface ServerSuccess<T> {
  message: string;
  payload: T;
  hasError: false;
}

/**
 * Represents a failed server response with error details
 */
export interface ServerError {
  message: string;
  payload: null;
  hasError: true;
  errorDetails?: unknown;
}

/**
 * Union type for all possible server responses
 * Use this as the return type for server actions and data functions
 * 
 * @example
 * async function getUser(id: string): Promise<ServerResponse<User>> {
 *   try {
 *     const user = await db.user.findUnique({ where: { id } });
 *     return {
 *       message: "User found",
 *       payload: user,
 *       hasError: false
 *     };
 *   } catch (error) {
 *     return {
 *       message: "Error fetching user",
 *       payload: null,
 *       hasError: true,
 *       errorDetails: error
 *     };
 *   }
 * }
 */
export type ServerResponse<T = unknown> = ServerSuccess<T> | ServerError;

/**
 * Type for action functions that wrap async operations
 */
export type ActionFunction<T = unknown> = () => Promise<ServerResponse<T>>;

