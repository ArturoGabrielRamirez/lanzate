/**
 * Authentication feature type definitions
 *
 * These types are specific to the authentication feature and
 * demonstrate how to organize feature-specific types.
 */

/**
 * User data returned from the database
 *
 * This type represents a user as stored in the Prisma database
 */
export type UserData = {
  id: string;
  supabaseId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Authentication response type
 *
 * Example response type for authentication-related operations
 */
export type AuthResponse = {
  user: UserData | null;
  authenticated: boolean;
};

/**
 * User with stores count
 *
 * Extended user data that includes the number of stores owned
 */
export type UserWithStores = UserData & {
  storesCount: number;
};
