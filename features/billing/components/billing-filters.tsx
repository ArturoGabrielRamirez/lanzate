'use client';

/**
 * BillingFilters Component
 *
 * Client component for filtering billing history by payment status.
 * Uses FilterButtons component and integrates with nuqs for URL state.
 *
 * Features:
 * - Status filter: All, Approved, Pending, Refunded
 * - URL state synchronization via nuqs
 * - Responsive layout
 */

import { useQueryState } from 'nuqs';

import { FilterButtons } from '@/features/global/components/filter-buttons';
import type { FilterOption } from '@/features/global/types/filter-buttons';

const statusOptions: FilterOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Aprobados', value: 'APPROVED' },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'Reembolsados', value: 'REFUNDED' },
];

export function BillingFilters() {
  const [status, setStatus] = useQueryState('status', {
    defaultValue: '',
    shallow: false,
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Filtrar por estado:
        </span>
        <FilterButtons
          options={statusOptions}
          paramName="status"
          value={status}
          onChange={(value) => setStatus(value as string)}
        />
      </div>
    </div>
  );
}
