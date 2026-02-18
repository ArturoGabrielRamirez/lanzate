/**
 * DataTable Component Tests
 *
 * Tests the DataTable component and its sub-components for:
 * - Column rendering based on column config
 * - Sorting toggle when header clicked
 * - Custom cell renderer display
 * - Empty state display when no data
 * - Loading state display
 *
 * Priority: HIGH - Core reusable component for billing feature
 */

import { render, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';

import { DataTable } from '@/features/global/components/table/data-table';
import type { ColumnDef } from '@/features/global/types/data-table';

// Cleanup after each test to prevent element leakage
afterEach(() => {
  cleanup();
});

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
    it('should render column headers based on column config', () => {
      const { getByText } = render(
        <DataTable<TestUser>
          data={testUsers}
          columns={testColumns}
        />
      );

      // Verify all column headers are rendered
      expect(getByText('Name')).toBeDefined();
      expect(getByText('Email')).toBeDefined();
      expect(getByText('Status')).toBeDefined();
    });

    it('should render data rows with correct cell values', () => {
      const { getAllByText } = render(
        <DataTable<TestUser>
          data={testUsers}
          columns={testColumns}
        />
      );

      // Verify data is rendered (use getAllByText as there may be multiple matches)
      expect(getAllByText('John Doe').length).toBeGreaterThan(0);
      expect(getAllByText('john@example.com').length).toBeGreaterThan(0);
      expect(getAllByText('Jane Smith').length).toBeGreaterThan(0);
      expect(getAllByText('Bob Johnson').length).toBeGreaterThan(0);
    });
  });

  describe('Sorting', () => {
    it('should call onSort when sortable column header is clicked', () => {
      const mockOnSort = mock(() => {});

      const { getByText } = render(
        <DataTable<TestUser>
          data={testUsers}
          columns={testColumns}
          onSort={mockOnSort}
        />
      );

      // Click on the "Name" header (which is sortable)
      const nameHeader = getByText('Name');
      fireEvent.click(nameHeader);

      // Verify onSort was called
      expect(mockOnSort).toHaveBeenCalled();
    });

    it('should not call onSort when non-sortable column header is clicked', () => {
      const mockOnSort = mock(() => {});

      const { getByText } = render(
        <DataTable<TestUser>
          data={testUsers}
          columns={testColumns}
          onSort={mockOnSort}
        />
      );

      // Click on the "Status" header (which is NOT sortable)
      const statusHeader = getByText('Status');
      fireEvent.click(statusHeader);

      // Verify onSort was NOT called
      expect(mockOnSort).not.toHaveBeenCalled();
    });
  });

  describe('Custom Cell Renderer', () => {
    it('should render custom cell content when cell renderer is provided', () => {
      const columnsWithRenderer: ColumnDef<TestUser>[] = [
        {
          id: 'name',
          header: 'Name',
          accessor: (row) => row.name,
        },
        {
          id: 'status',
          header: 'Status',
          accessor: (row) => row.status,
          cell: (value) => (
            <span data-testid="status-badge">
              {value === 'active' ? 'ACTIVE' : 'INACTIVE'}
            </span>
          ),
        },
      ];

      const { getAllByTestId, getAllByText } = render(
        <DataTable<TestUser>
          data={testUsers}
          columns={columnsWithRenderer}
        />
      );

      // Verify custom renderer output
      const badges = getAllByTestId('status-badge');
      expect(badges.length).toBe(3); // One for each row
      expect(getAllByText('ACTIVE').length).toBeGreaterThan(0);
      expect(getAllByText('INACTIVE').length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('should display empty state when data array is empty', () => {
      const { getByText } = render(
        <DataTable<TestUser>
          data={[]}
          columns={testColumns}
          emptyMessage="No users found"
        />
      );

      // Verify empty message is displayed
      expect(getByText('No users found')).toBeDefined();
    });

    it('should display default empty message when no custom message provided', () => {
      const { getByText } = render(
        <DataTable<TestUser>
          data={[]}
          columns={testColumns}
        />
      );

      // Verify default empty message
      expect(getByText('No results.')).toBeDefined();
    });
  });

  describe('Loading State', () => {
    it('should display loading skeleton when isLoading is true', () => {
      const { container } = render(
        <DataTable<TestUser>
          data={[]}
          columns={testColumns}
          isLoading={true}
        />
      );

      // Verify skeleton elements are present (Skeleton component from shadcn)
      // The Skeleton component uses animate-pulse class
      const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not display user data when isLoading is true', () => {
      const { queryByText } = render(
        <DataTable<TestUser>
          data={testUsers}
          columns={testColumns}
          isLoading={true}
        />
      );

      // User data should not be visible during loading
      expect(queryByText('John Doe')).toBeNull();
    });
  });
});
