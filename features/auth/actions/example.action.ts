"use server";

/**
 * Example Server Action demonstrating the action pattern
 *
 * This file demonstrates the Server Action pattern used throughout the application.
 * Server Actions are the entry point for client-side code to interact with the server.
 *
 * Key patterns:
 * - Always start with "use server" directive
 * - Import actionWrapper from global utils
 * - Import format-response utilities (formatSuccess, formatError)
 * - Call data layer functions from features/auth/data/
 * - Return typed ServerResponse
 * - Let actionWrapper handle all error cases
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations}
 */

import { actionWrapper, formatSuccess } from "@/features/global/utils";
import { getUserBySupabaseId } from "@/features/auth/data";
import { ServerResponse } from "@/features/global/types";
import { UserWithStores } from "@/features/auth/types";

/**
 * Get user data by Supabase ID
 *
 * This example demonstrates:
 * - Using actionWrapper for consistent error handling
 * - Calling data layer functions
 * - Formatting success responses
 * - Returning typed responses
 *
 * @param supabaseId - The Supabase user ID to look up
 * @returns ServerResponse with user data or error
 *
 * @example
 * ```tsx
 * // In a Client Component:
 * const handleGetUser = async () => {
 *   const result = await getUserAction("user-123");
 *   if (result.hasError) {
 *     console.error(result.message);
 *   } else {
 *     console.log(result.payload);
 *   }
 * };
 * ```
 */
export async function getUserAction(
  supabaseId: string
): Promise<ServerResponse<UserWithStores>> {
  return actionWrapper(async () => {
    // Call data layer function
    const user = await getUserBySupabaseId(supabaseId);

    // Return formatted success response
    return formatSuccess("User fetched successfully", user);
  });
}

/**
 * Get current authenticated user
 *
 * This example demonstrates fetching the current user from Supabase auth
 * and then querying their data from the database.
 *
 * @returns ServerResponse with user data or error
 *
 * @example
 * ```tsx
 * // In a Server Component:
 * const result = await getCurrentUserAction();
 * if (!result.hasError && result.payload) {
 *   return <div>Welcome, {result.payload.email}!</div>;
 * }
 * ```
 */
export async function getCurrentUserAction(): Promise<
  ServerResponse<UserWithStores>
> {
  return actionWrapper(async () => {
    // Note: In a real implementation, you would:
    // 1. Import createClient from @/lib/supabase/server
    // 2. Get the current user from Supabase
    // 3. Use their supabaseId to fetch from database
    //
    // Example:
    // const supabase = await createClient();
    // const { data: { user }, error } = await supabase.auth.getUser();
    // if (error || !user) throw new Error("Not authenticated");
    // const userData = await getUserBySupabaseId(user.id);

    // For this example, we'll throw an error to demonstrate error handling
    throw new Error(
      "This is an example action - implement Supabase auth integration"
    );
  });
}
