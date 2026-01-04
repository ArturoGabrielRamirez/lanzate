/**
 * Get User by Supabase ID - Data Layer
 *
 * Fetches a user from the database using their Supabase authentication ID.
 * Includes the count of stores associated with the user.
 *
 * This is a data layer function that performs direct database operations.
 * It should be called from service or action layers, not directly from UI components.
 */

import { prisma } from '@/lib/prisma';
import { UserWithStores } from '@/features/auth/types';

/**
 * Fetch user by Supabase ID with stores count
 *
 * Queries the database for a user record matching the provided Supabase ID
 * and includes the count of stores owned by the user.
 *
 * @param supabaseId - The Supabase user ID to look up
 * @returns User data with stores count
 * @throws Error if database query fails or user not found
 *
 * @example
 * ```ts
 * // In a service or action:
 * const user = await getUserBySupabaseId("abc123-supabase-id");
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
      throw new Error('User not found in database');
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
    throw new Error('Failed to fetch user data');
  }
}
