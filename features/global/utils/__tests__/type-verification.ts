/**
 * Type verification test
 *
 * This file verifies that TypeScript types are correctly inferred
 * and that the utilities work as expected with proper type safety.
 *
 * This is NOT a runtime test - it's meant to be compiled to verify
 * that types work correctly.
 */

import { getUserAction } from "@/features/auth/actions";
import { formatSuccess, formatError } from "@/features/global/utils";
import type { ServerResponse } from "@/features/global/types";
import type { UserWithStores } from "@/features/auth/types";

/**
 * Verify that Server Action returns properly typed response
 */
async function verifyActionTypes() {
  // Should infer ServerResponse<UserWithStores>
  const response: ServerResponse<UserWithStores> = await getUserAction("user-123");

  // Type narrowing with type guards
  if (response.hasError) {
    // In error case, payload is null
    console.log(response.message);
    console.log(response.payload); // null
  } else {
    // In success case, payload should be UserWithStores
    // TypeScript now knows payload is not null
    if (response.payload) {
      console.log(response.payload.email);
      console.log(response.payload.storesCount);
    }
  }
}

/**
 * Verify formatSuccess types
 */
function verifyFormatSuccessTypes() {
  const user: UserWithStores = {
    id: "123",
    supabaseId: "sub-123",
    email: "user@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
    storesCount: 5,
  };

  // Should return ServerSuccess<UserWithStores>
  const response = formatSuccess("User found", user);

  // Verify the structure
  console.log(response.hasError); // false
  console.log(response.message); // "User found"
  console.log(response.payload.email); // payload is guaranteed to exist
}

/**
 * Verify formatError types
 */
function verifyFormatErrorTypes() {
  // Should return ServerError
  const response = formatError("Something went wrong");

  // Verify the structure
  console.log(response.hasError); // true
  console.log(response.message); // "Something went wrong"
  console.log(response.payload); // null
}

// Export for potential usage
export { verifyActionTypes, verifyFormatSuccessTypes, verifyFormatErrorTypes };
