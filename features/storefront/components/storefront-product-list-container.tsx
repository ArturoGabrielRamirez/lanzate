'use client';

/**
 * Storefront Product List Container (Client Component)
 *
 * Manages search, sort, and pagination URL state via nuqs.
 * Receives initial data from its Server Component parent and updates
 * the URL when the user interacts with filters — the server then
 * re-fetches with the new searchParams, maintaining server-first approach.
 *
 * Pattern:
 *   Server Component reads searchParams → fetches data →
 *   passes to this container → user filters → URL updates →
 *   Server Component re-renders with new searchParams
 */

import { Search, ChevronDown, X } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useTransition } from 'react';

import { Button } from '@/features/global/components/button/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/features/shadcn/components/ui/dropdown-menu';
import { Input } from '@/features/shadcn/components/ui/input';
import { StorefrontProductGrid } from '@/features/storefront/components/storefront-product-grid';
import type { StorefrontProductListContainerProps } from '@/features/storefront/types/storefront.types';

// ─── Sort options ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
    { value: 'createdAt-desc', label: 'Más recientes' },
    { value: 'price-asc', label: 'Menor precio' },
    { value: 'price-desc', label: 'Mayor precio' },
    { value: 'name-asc', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
] as const;

// ─── nuqs parsers ────────────────────────────────────────────────────────────

const listParsers = {
    search: parseAsString.withDefault(''),
    sort: parseAsString.withDefault('createdAt-desc'),
    page: parseAsInteger.withDefault(1),
};

// ─── Component ───────────────────────────────────────────────────────────────

export function StorefrontProductListContainer({
    initialProducts,
    totalPages,
    totalCount,
    storeSubdomain,
    /* initialSearch = '',
    initialSort = 'createdAt-desc',
    initialPage = 1, */
}: StorefrontProductListContainerProps) {
    const [isPending, startTransition] = useTransition();

    const [{ search, sort, page }, setQuery] = useQueryStates(listParsers, {
        shallow: false,          // triggers server re-fetch when URL changes
        startTransition,
    });

    const currentSortLabel =
        SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Ordenar por';

    const hasActiveFilters = search !== '' || sort !== 'createdAt-desc';

    function handleSearchChange(value: string) {
        setQuery({ search: value || null, page: 1 });
    }

    function handleSortChange(value: string) {
        setQuery({ sort: value, page: 1 });
    }

    function handlePageChange(newPage: number) {
        setQuery({ page: newPage });
    }

    function handleClearFilters() {
        setQuery({ search: null, sort: null, page: 1 });
    }

    return (
        <div className={isPending ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            {/* ── Filters bar ── */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search input */}
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                        type="search"
                        placeholder="Buscar productos..."
                        defaultValue={search}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Debounce via a small timeout to avoid hammering the router
                            clearTimeout((window as typeof window & { _sfSearchTimeout?: ReturnType<typeof setTimeout> })._sfSearchTimeout);
                            (window as typeof window & { _sfSearchTimeout?: ReturnType<typeof setTimeout> })._sfSearchTimeout = setTimeout(() => handleSearchChange(val), 350);
                        }}
                        className="pl-10"
                        aria-label="Buscar productos"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Sort dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="justify-between gap-2 min-w-[160px]">
                                <span className="truncate">{currentSortLabel}</span>
                                <ChevronDown className="h-4 w-4 shrink-0" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {SORT_OPTIONS.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={sort === option.value ? 'bg-accent text-accent-foreground' : ''}
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            aria-label="Limpiar filtros"
                        >
                            <X className="h-4 w-4" />
                            <span className="ml-1 text-xs">Limpiar</span>
                        </Button>
                    )}
                </div>

                {/* Result count */}
                <p className="text-sm text-muted-foreground sm:ml-auto">
                    {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
                </p>
            </div>

            {/* ── Products grid ── */}
            <StorefrontProductGrid
                products={initialProducts}
                storeSubdomain={storeSubdomain}
                emptyMessage="No se encontraron productos con los filtros seleccionados."
            />

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        Anterior
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
}
