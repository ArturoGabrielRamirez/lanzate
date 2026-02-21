'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { DataTable } from '@/features/global/components/table';
import type { ColumnDef, SortConfig } from '@/features/global/types/data-table';
import { PRODUCT_STATUS_MESSAGES, PRODUCT_UI_MESSAGES } from '@/features/products/constants';
import type { Product, ProductDataTableProps } from '@/features/products/types/product.types';

/**
 * ProductDataTable Component
 *
 * Client component that displays products in a data table format.
 * Receives initial data from the server component and handles
 * client-side sorting interactions.
 *
 * Note: Full functionality (search, filters, pagination, bulk actions)
 * will be implemented in Task 7.3, 7.4, and 7.5.
 */
export function ProductDataTable({
  initialData,
  totalItems,
  storeId,
}: ProductDataTableProps) {
  const t = useTranslations();
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'createdAt',
    direction: 'desc',
  });

  /**
   * Product column definitions for DataTable
   *
   * Defines how each column should display product data.
   * More columns will be added in Task 7.3 (image, SKU, price, stock, actions).
   */
  const productColumns: ColumnDef<Product>[] = [
    {
      id: 'name',
      header: 'Nombre',
      accessor: (row) => row.name,
      sortable: true,
    },
    {
      id: 'status',
      header: 'Estado',
      accessor: (row) => row.status,
      sortable: true,
      cell: (value) => {
        const statusColors = {
          ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          DRAFT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };
        const status = value as keyof typeof statusColors;
        const statusLabel = t(PRODUCT_STATUS_MESSAGES[status] ?? PRODUCT_STATUS_MESSAGES.DRAFT);

        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[status] ?? statusColors.DRAFT}`}
          >
            {statusLabel}
          </span>
        );
      },
    },
    {
      id: 'createdAt',
      header: 'Fecha de creacion',
      accessor: (row) => row.createdAt,
      sortable: true,
      cell: (value) => {
        const date = value as Date;
        return new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
  ];

  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
  };

  return (
    <div className="rounded-lg border bg-card">
      <DataTable<Product>
        data={initialData}
        columns={productColumns}
        sortConfig={sortConfig}
        onSort={handleSort}
        emptyMessage={t(PRODUCT_UI_MESSAGES.NO_PRODUCTS)}
      />
    </div>
  );
}
