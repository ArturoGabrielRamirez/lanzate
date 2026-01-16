/**
 * Get User Stores Data
 *
 * Data layer function to fetch user's stores for the dashboard.
 * Returns limited stores (for display) plus total count.
 *
 * @param supabaseId - The Supabase user ID
 * @param limit - Maximum number of stores to return. If undefined, returns all stores.
 * @returns User with stores and account type, or null if not found
 */

import { prisma } from '@/lib/prisma';

export async function getUserStoresData(supabaseId: string, limit?: number) {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        supabaseId,
      },
      include: {
        stores: {
          ...(limit !== undefined && { take: limit }),
          orderBy: {
            createdAt: 'desc',
          },
        },
        subscription: {
          select: {
            accountType: true,
          },
        },
        _count: {
          select: {
            stores: true,
          },
        },
      },
    });

    if (!userData) {
      return null;
    }

    return {
      stores: userData.stores,
      accountType: userData.subscription?.accountType ?? 'FREE',
      totalCount: userData._count.stores,
    };
  } catch (error) {
    console.error('Error fetching user stores:', error);
    throw new Error('Failed to fetch user stores from database');
  }
}
