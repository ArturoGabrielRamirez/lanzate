/**
 * Get User Dashboard Data
 *
 * Data layer function to fetch user data and related stores for the dashboard.
 * This function queries the database and returns the user information along
 * with their stores count.
 *
 * @param supabaseId - The Supabase user ID to query by
 * @returns User data with stores or null if not found
 * @throws Error if database query fails
 */

import { prisma } from '@/lib/prisma';

export async function getUserDashboardData(supabaseId: string) {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        supabaseId,
      },
      include: {
        stores: true,
      },
    });

    return userData;
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    throw new Error('Failed to fetch user data from database');
  }
}
