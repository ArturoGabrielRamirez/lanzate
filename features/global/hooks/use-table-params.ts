import { 
  useQueryState, 
  useQueryStates, 
  parseAsString, 
  parseAsInteger, 
  type Options,
  type Parser
} from 'nuqs';

import type { TableSortState } from '@/features/global/types/table-params';

/**
 * Extrae el tipo de valor que maneja un Parser.
 */
type InferParserType<P> = P extends Parser<infer T> ? T : never;

/**
 * Mapa de parsers utilizando unknown para evitar el error de ESLint.
 */
type ParserMap = Record<string, Parser<unknown>>;

export function useTableParams<T extends ParserMap>(
  filterParsers: T,
  defaultPageSize = 10
) {
  // 1. Paginación
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(defaultPageSize));

  // 2. Sorting
  const [sortBy, setSortBy] = useQueryState('sortBy', parseAsString.withDefault(''));
  const [sortOrder, setSortOrder] = useQueryState('sortOrder', parseAsString.withDefault(''));

  // 3. Filtros Dinámicos
  const [filters, setFilters] = useQueryStates(filterParsers);

  // Helper de ordenamiento
  const sorting: TableSortState = {
    sortBy: sortBy || null,
    setSortBy: (value) => setSortBy(value || ''),
    sortOrder: (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : null,
    setSortOrder: (value) => setSortOrder(value || ''),
  };

  /**
   * Tipado estricto para la actualización.
   */
  type FilterUpdateValues = { [K in keyof T]?: InferParserType<T[K]> | null };

  const updateFilters = (
    newValues: FilterUpdateValues | null, 
    options?: Options
  ) => {
    /**
     * Para evitar 'any', convertimos a 'unknown' primero y luego al tipo 
     * esperado por setFilters. Esto es seguro porque FilterUpdateValues 
     * es estructuralmente idéntico a lo que useQueryStates espera.
     */
    const values = newValues as Parameters<typeof setFilters>[0];
    return setFilters(values, options);
  };

  const buildQueryParams = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== null && v !== '')
    );

    return {
      page,
      pageSize,
      sortBy: sorting.sortBy,
      sortOrder: sorting.sortOrder,
      ...cleanFilters,
    };
  };

  return {
    pagination: {
      page,
      pageSize,
      setPage,
      setPageSize,
    },
    sorting,
    filters,
    setFilters: updateFilters,
    buildQueryParams,
  };
}