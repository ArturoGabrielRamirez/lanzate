"use client";

import { useState } from "react";
import { DataTable } from "@/features/global/components/table";
import type { ColumnDef, SortConfig } from "@/features/global/types/data-table";

// Sample data type
interface TestUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user' | 'moderator';
  lastLogin: string;
}

// Sample test data
const testUsers: TestUser[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', role: 'admin', lastLogin: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', role: 'user', lastLogin: '2024-01-10' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'active', role: 'moderator', lastLogin: '2024-01-14' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'active', role: 'user', lastLogin: '2024-01-13' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive', role: 'moderator', lastLogin: '2024-01-08' },
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
    sortable: true,
    cell: (value) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}
      >
        {value === 'active' ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    id: 'role',
    header: 'Role',
    accessor: (row) => row.role,
    sortable: true,
  },
  {
    id: 'lastLogin',
    header: 'Last Login',
    accessor: (row) => row.lastLogin,
    sortable: true,
  },
];

export default function DataTableTestPage() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: null });
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const handleSort = (newSortConfig: SortConfig) => {
    setSortConfig(newSortConfig);
  };

  const handleToggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const handleToggleEmpty = () => {
    setShowEmpty(!showEmpty);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">DataTable Component Test</h1>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleToggleLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isLoading ? 'Show Data' : 'Show Loading'}
          </button>
          
          <button
            onClick={handleToggleEmpty}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {showEmpty ? 'Show All' : 'Show Empty'}
          </button>
          
          {sortConfig.column && (
            <div className="px-4 py-2 bg-gray-100 rounded text-sm">
              Sort: {sortConfig.column} ({sortConfig.direction})
            </div>
          )}
        </div>
      </div>

      <div className="border rounded-lg">
        <DataTable<TestUser>
          data={showEmpty ? [] : testUsers}
          columns={testColumns}
          isLoading={isLoading}
          emptyMessage="No users found. Try adding some test data!"
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Features Tested:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ Generic TypeScript typing</li>
          <li>✅ Custom cell renderers (Status badges)</li>
          <li>✅ Sortable columns with visual indicators</li>
          <li>✅ Loading skeleton state</li>
          <li>✅ Empty state with custom message</li>
          <li>✅ shadcn/ui Table components integration</li>
          <li>✅ TanStack Table backend</li>
        </ul>
      </div>
    </div>
  );
}