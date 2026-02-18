'use client';

/**
 * BillingHistoryTable Component
 *
 * Client component that displays payment history in a DataTable.
 * Features:
 * - Payment-specific columns (date, amount, status, actions)
 * - Download invoice button in actions column
 * - Integrates with URL-based pagination (nuqs)
 *
 * @example
 * ```tsx
 * <BillingHistoryTable
 *   payments={payments}
 *   subscriptionId={subscription.id}
 *   initialPagination={{ total, page, pageSize, totalPages }}
 * />
 * ```
 */

import { Download } from 'lucide-react';

import { PaymentStatusBadge } from '@/features/billing/components/payment-status-badge';
import type { Payment, PaymentStatus } from '@/features/billing/types/billing';
import type { BillingHistoryTableProps } from '@/features/billing/types/billing-history-table';
import { Button } from "@/features/global/components/button/button";
import { DataTable } from '@/features/global/components/table';
import type { ColumnDef } from '@/features/global/types/data-table';

/**
 * Formats a date for Argentine locale display
 */
function formatDate(date: Date | string | null): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Formats amount as ARS currency
 */
function formatAmount(amount: number | string, currency: string = 'ARS'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
  }).format(numAmount);
}

export function BillingHistoryTable({
  payments,
  emptyMessage = 'No hay pagos registrados',
}: BillingHistoryTableProps) {
  /**
   * Handle invoice download
   */
  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      // Open download URL in new tab
      window.open(`/api/billing/invoice/${paymentId}`, '_blank');
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  /**
   * Column definitions for the payments table
   */
  const columns: ColumnDef<Payment>[] = [
    {
      id: 'paidAt',
      header: 'Fecha',
      accessor: (row) => formatDate(row.paidAt || row.createdAt),
      sortable: true,
    },
    {
      id: 'mercadopagoPaymentId',
      header: 'ID Pago',
      accessor: (row) => row.mercadopagoPaymentId,
      cell: (value) => (
        <span className="font-mono text-xs">{String(value).slice(-8)}</span>
      ),
    },
    {
      id: 'amount',
      header: 'Monto',
      accessor: (row) => Number(row.amount),
      cell: (value, row) => (
        <span className="font-medium">
          {formatAmount(value as number, row.currency)}
        </span>
      ),
      sortable: true,
    },
    {
      id: 'status',
      header: 'Estado',
      accessor: (row) => row.status,
      cell: (value) => <PaymentStatusBadge status={value as PaymentStatus} />,
    },
    {
      id: 'actions',
      header: 'Acciones',
      accessor: (row) => row.id,
      cell: (value, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownloadInvoice(row.id)}
          className="h-8 w-8 p-0"
          title="Descargar factura"
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Descargar factura</span>
        </Button>
      ),
    },
  ];

  return (
    <DataTable<Payment>
      data={payments}
      columns={columns}
      emptyMessage={emptyMessage}
    />
  );
}
