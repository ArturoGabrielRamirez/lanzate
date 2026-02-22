import { ProductStatus } from "@/features/products/types";

export interface ParsedProductParams {
    search: string;
    status?: ProductStatus;
    sortBy: 'name' | 'createdAt' | 'updatedAt';
    page: number;
    pageSize: number;
}

/**
 * Parses search parameters for the product listing page.
 */
export function parseProductQueryParams(searchParams: Record<string, string>): ParsedProductParams {
    const search = typeof searchParams.search === 'string' ? searchParams.search : '';

    const statusParam = typeof searchParams.status === 'string' ? searchParams.status : '';
    const status = statusParam && ['ACTIVE', 'DRAFT', 'ARCHIVED'].includes(statusParam)
        ? (statusParam as ProductStatus)
        : undefined;

    const sortParam = typeof searchParams.sort === 'string' ? searchParams.sort : 'createdAt';
    const sortBy = ['name', 'createdAt', 'updatedAt'].includes(sortParam)
        ? (sortParam as 'name' | 'createdAt' | 'updatedAt')
        : 'createdAt';

    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
    const pageSize = typeof searchParams.pageSize === 'string' ? parseInt(searchParams.pageSize, 10) : 10;

    return {
        search,
        status,
        sortBy,
        page: !isNaN(page) && page > 0 ? page : 1,
        pageSize: !isNaN(pageSize) && pageSize > 0 ? pageSize : 10,
    };
}
