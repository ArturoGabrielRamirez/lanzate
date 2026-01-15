/**
 * Type definitions for the BillingHistoryTable component
 *
 * These types define the props for the billing history table component
 * which displays paginated payment records with filtering and actions.
 */

import type { Payment, PaginatedPayments } from '@/features/billing/types/billing';

/**
 * Props for the BillingHistoryTable component
 *
 * @property payments - Array of payment records to display
 * @property subscriptionId - The subscription ID for fetching more data
 * @property initialPagination - Initial pagination state from server
 * @property emptyMessage - Custom message to show when no payments
 */
export interface BillingHistoryTableProps {
  payments: Payment[];
  subscriptionId: string;
  initialPagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  emptyMessage?: string;
}

/**
 * Payment row data for display in the table
 * Extends Payment with computed/formatted fields
 */
export interface PaymentRowData extends Payment {
  formattedAmount: string;
  formattedDate: string;
}
