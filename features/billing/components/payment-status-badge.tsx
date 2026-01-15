/**
 * PaymentStatusBadge Component
 *
 * Color-coded badge displaying payment status.
 * Uses shadcn/ui Badge with appropriate variant styling.
 *
 * Status colors:
 * - APPROVED: green (default)
 * - PENDING: yellow (secondary)
 * - REJECTED: red (destructive)
 * - REFUNDED: blue (outline)
 * - PARTIALLY_REFUNDED: blue (outline)
 * - CANCELLED: gray (secondary)
 */

import type { PaymentStatus } from '@/features/billing/types/billing';
import { Badge } from '@/features/shadcn/components/ui/badge';
import { cn } from '@/features/shadcn/utils/cn';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

/**
 * Maps payment status to badge variant and custom styles
 */
function getStatusConfig(status: PaymentStatus): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  label: string;
  className?: string;
} {
  switch (status) {
    case 'APPROVED':
      return {
        variant: 'default',
        label: 'Aprobado',
        className: 'bg-green-600 hover:bg-green-700',
      };
    case 'PENDING':
      return {
        variant: 'secondary',
        label: 'Pendiente',
        className: 'bg-yellow-500 text-yellow-950 hover:bg-yellow-600',
      };
    case 'REJECTED':
      return {
        variant: 'destructive',
        label: 'Rechazado',
      };
    case 'REFUNDED':
      return {
        variant: 'outline',
        label: 'Reembolsado',
        className: 'border-blue-500 text-blue-600',
      };
    case 'PARTIALLY_REFUNDED':
      return {
        variant: 'outline',
        label: 'Reembolso parcial',
        className: 'border-blue-500 text-blue-600',
      };
    case 'CANCELLED':
      return {
        variant: 'secondary',
        label: 'Cancelado',
      };
    default:
      return {
        variant: 'secondary',
        label: status,
      };
  }
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
