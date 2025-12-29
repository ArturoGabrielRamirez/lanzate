/**
 * Example data layer function demonstrating Prisma usage
 *
 * This file demonstrates the data layer pattern used throughout the application.
 * Data layer functions are responsible for direct database operations using Prisma.
 *
 * Key patterns:
 * - Import the Prisma client from lib/prisma
 * - Use try-catch for error handling
 * - Throw errors to be caught by the action layer
 * - Return typed data based on feature-specific types
 * - Keep data functions focused on a single database operation
 */

import { prisma } from "@/lib/prisma";
import { UserWithStores } from "@/features/auth/types";

/**
 * Fetch user by Supabase ID with stores count
 *
 * This example demonstrates:
 * - Querying a user from the database
 * - Including related data (stores count)
 * - Error handling with try-catch
 * - Returning typed data
 *
 * @param supabaseId - The Supabase user ID to look up
 * @returns User data with stores count
 * @throws Error if database query fails or user not found
 *
 * @example
 * ```ts
 * const user = await getUserBySupabaseId("user-123");
 * console.log(`User ${user.email} has ${user.storesCount} stores`);
 * ```
 */
export async function getUserBySupabaseId(
  supabaseId: string
): Promise<UserWithStores> {
  try {
    // Query user from database
    const user = await prisma.user.findUnique({
      where: {
        supabaseId,
      },
      include: {
        _count: {
          select: {
            stores: true,
          },
        },
      },
    });

    // Handle not found case
    if (!user) {
      throw new Error("User not found in database");
    }

    // Return typed data
    return {
      id: user.id,
      supabaseId: user.supabaseId,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      storesCount: user._count.stores,
    };
  } catch (error) {
    // Re-throw errors to be handled by action layer
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch user data");
  }
}

/**
 * Create a new user in the database
 *
 * This example demonstrates creating a new record with Prisma
 *
 * @param supabaseId - Supabase user ID
 * @param email - User email address
 * @returns Created user data
 * @throws Error if database operation fails
 *
 * @example
 * ```ts
 * const newUser = await createUser("user-123", "user@example.com");
 * ```
 */
export async function createUser(
  supabaseId: string,
  email: string
): Promise<UserWithStores> {
  try {
    const user = await prisma.user.create({
      data: {
        supabaseId,
        email,
      },
      include: {
        _count: {
          select: {
            stores: true,
          },
        },
      },
    });

    return {
      id: user.id,
      supabaseId: user.supabaseId,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      storesCount: user._count.stores,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create user");
  }
}
