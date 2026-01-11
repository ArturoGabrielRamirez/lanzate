/**
 * Get Payments By Subscription Data Function
 *
 * Pure database operation to retrieve paginated payments for a subscription.
 * Does NOT contain business logic - only database interaction.
 *
 * @param subscriptionId - The subscription ID
 * @param filters - Optional pagination and filter parameters
 * @returns Paginated payments with metadata
 *
 * @example
 * const result = await getPaymentsBySubscriptionData('sub-123', {
 *   page: 1,
 *   pageSize: 10,
 *   status: 'APPROVED',
 * });
 */

import type { PaymentFilters, PaginatedPayments } from '@/features/billing/types/billing';
import { prisma } from '@/lib/prisma';

import type { PaymentStatus } from '@prisma/client';

export async function getPaymentsBySubscriptionData(
  subscriptionId: string,
  filters?: PaymentFilters
): Promise<PaginatedPayments> {
  const page = filters?.page ?? 1;
  const pageSize = filters?.pageSize ?? 10;
  const skip = (page - 1) * pageSize;

  // Build where clause
  const where: {
    subscriptionId: string;
    status?: PaymentStatus;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = {
    subscriptionId,
  };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.createdAt.lte = filters.dateTo;
    }
  }

  // Execute count and findMany in parallel
  const [total, data] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}
