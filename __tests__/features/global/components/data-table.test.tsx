/**
 * DataTable Component Tests
 *
 * Test-first approach: These tests define the expected interface for the DataTable
 * component that will be implemented in `features/global/components/data-table.tsx`.
 *
 * The DataTable component should:
 * - Be a generic, reusable table component
 * - Use shadcn/ui Table components as base
 * - Support sortable columns with visual indicators
 * - Support custom cell renderers via column config
 * - Include loading skeleton state
 * - Include empty state with customizable message
 *
 * Coverage:
 * - Column rendering based on column config
 * - Sorting toggle when header clicked
 * - Custom cell renderer display
 * - Empty state display when no data
 */

import { describe, it, expect, mock } from 'bun:test';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '@/features/global/components/table/data-table';
import type { ColumnDef, SortConfig } from '@/features/global/types/data-table';

// Sample data type for testing
interface TestUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

// Sample test data
const testUsers: TestUser[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
];

// Sample column definitions
const testColumns: ColumnDef<TestUser>[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: (row) => row.name,
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessor: (row) => row.email,
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => row.status,
    sortable: false,
  },
];

describe('DataTable Component', () => {
  describe('Column Rendering', () => {
    it('should render columns based on column config', () => {
      render(
        <DataTable<TestUser>
          data={testUsers}
          columns={testColumns}
        />
      );

      // Verify all column headers are rendered
      expect(screen.getByText('Name')).toBeDefined();
      expect(screen.getByText('Email')).toBeDefined();
      expect(screen.getByText('Status')).toBeDefined();

      // Verify data rows are rendered
      expect(screen.getByText('John Doe')).toBeDefined();
      expect(screen.getByText('jane@example.com')).toBeDefined();
      expect(screen.getByText('active')).toBeDefined();
    });
  });

  describe('Sorting', () => {
    it('should toggle sorting when sortable header is clicked', () => {
      const handleSort = mock((sortConfig: SortConfig) => {});

      render(
        <DataTable<TestUser>
          data={testUsers}
          columns={testColumns}
          onSort={handleSort}
          sortConfig={{ column: null, direction: null }}
        />
      );

      // Click on the Name header (which is sortable)
      const nameHeader = screen.getByText('Name');
      fireEvent.click(nameHeader);

      // Verify onSort was called with the correct column
      expect(handleSort).toHaveBeenCalled();
      const callArgs = handleSort.mock.calls[0][0];
      expect(callArgs.column).toBe('name');
      expect(callArgs.direction).toBe('asc');
    });
  });

  describe('Custom Cell Renderer', () => {
    it('should display custom cell renderer correctly', () => {
      const columnsWithCustomRenderer: ColumnDef<TestUser>[] = [
        ...testColumns.slice(0, 2),
        {
          id: 'status',
          header: 'Status',
          accessor: (row) => row.status,
          sortable: false,
          cell: (value, row) => (
            <span
              data-testid={`status-badge-${row.id}`}
              className={value === 'active' ? 'text-green-500' : 'text-red-500'}
            >
              {value === 'active' ? 'Active' : 'Inactive'}
            </span>
          ),
        },
      ];

      render(
        <DataTable<TestUser>
          data={testUsers}
          columns={columnsWithCustomRenderer}
        />
      );

      // Verify custom renderer output is displayed
      expect(screen.getByTestId('status-badge-1')).toBeDefined();
      expect(screen.getByText('Active')).toBeDefined();
      expect(screen.getByText('Inactive')).toBeDefined();

      // Verify custom styling is applied
      const activeBadge = screen.getByTestId('status-badge-1');
      expect(activeBadge.className).toContain('text-green-500');
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no data is provided', () => {
      render(
        <DataTable<TestUser>
          data={[]}
          columns={testColumns}
          emptyMessage="No users found"
        />
      );

      // Verify empty state message is displayed
      expect(screen.getByText('No users found')).toBeDefined();

      // Verify data cells are not rendered
      expect(screen.queryByText('John Doe')).toBeNull();
    });

    it('should display default empty message when no custom message is provided', () => {
      render(
        <DataTable<TestUser>
          data={[]}
          columns={testColumns}
        />
      );

      // Verify default empty state message is displayed
      expect(screen.getByText('No results.')).toBeDefined();
    });
  });
});
