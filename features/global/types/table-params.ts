export type TableSortState = {
  sortBy: string | null;
  setSortBy: (value: string | null) => void;
  sortOrder: 'asc' | 'desc' | null;
  setSortOrder: (value: 'asc' | 'desc' | null) => void;
};