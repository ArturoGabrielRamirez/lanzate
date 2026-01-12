'use server';

/**
 * Get Billing History Server Action
 *
 * Fetches paginated payment history for a subscription with optional filters.
 * This action validates input, calls the data layer, and returns a consistent
 * ServerResponse format.
 *
 * Flow:
 * 1. Validate subscriptionId with Yup schema
 * 2. Validate filters with paymentFiltersSchema
 * 3. Call data layer for paginated payments
 * 4. Return ServerResponse with PaginatedPayments
 *
 * @param subscriptionId - The subscription ID to fetch payments for
 * @param filters - Optional filters for pagination, status, and date range
 * @returns ServerResponse with paginated payments data
 *
 * @example
 * ```tsx
 * import { getBillingHistoryAction } from '@/features/billing/actions/get-billing-history.action';
 *
 * const result = await getBillingHistoryAction(subscriptionId, {
 *   page: 1,
 *   pageSize: 10,
 *   status: 'APPROVED',
 * });
 *
 * if (!result.hasError && result.payload) {
 *   console.log('Payments:', result.payload.data);
 *   console.log('Total:', result.payload.total);
 * }
 * ```
 */

import { getPaymentsBySubscriptionData } from '@/features/billing/data';
import {
  paymentFiltersSchema,
  subscriptionIdSchema,
} from '@/features/billing/schemas/billing.schema';
import type { PaymentFilters, PaginatedPayments } from '@/features/billing/types/billing';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';

export async function getBillingHistoryAction(
  subscriptionId: string,
  filters?: PaymentFilters
): Promise<ServerResponse<PaginatedPayments>> {
  return actionWrapper(async () => {
    // Validate subscription ID
    const validatedSubscriptionId = await subscriptionIdSchema.validate(subscriptionId);

    // Validate and normalize filters with defaults
    const validatedFilters = await paymentFiltersSchema.validate(filters ?? {});

    // Convert validated filters to PaymentFilters type
    const normalizedFilters: PaymentFilters = {
      page: validatedFilters.page,
      pageSize: validatedFilters.pageSize,
      status: validatedFilters.status ?? undefined,
      dateFrom: validatedFilters.dateFrom ?? undefined,
      dateTo: validatedFilters.dateTo ?? undefined,
    };

    // Call data layer to fetch paginated payments
    const paginatedPayments = await getPaymentsBySubscriptionData(
      validatedSubscriptionId,
      normalizedFilters
    );

    return formatSuccess('Historial de pagos obtenido exitosamente', paginatedPayments);
  });
}
