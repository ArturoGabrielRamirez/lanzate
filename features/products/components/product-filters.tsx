"use client";

import { Search, ChevronDown, X } from 'lucide-react';
import { useState, useEffect, useTransition, useOptimistic } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from "@/features/global/components/button/button";
import { PRODUCT_STATUS_MESSAGES } from '@/features/products/constants';
import type { ProductFiltersProps, ProductSortSelectProps } from '@/features/products/types/product-listing.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/shadcn/components/ui/dropdown-menu';
import { Input } from '@/features/shadcn/components/ui/input';
import { cn } from '@/features/shadcn/utils/cn';

/**
 * Sort select dropdown component
 */
function ProductSortSelect({ value, onChange, className = "" }: ProductSortSelectProps) {
  const sortOptions = [
    {
      value: 'createdAt-desc',
      label: 'Más recientes',
      description: 'Productos agregados recientemente primero'
    },
    {
      value: 'price-asc',
      label: 'Menor precio',
      description: 'Productos con el precio más bajo primero'
    },
    {
      value: 'price-desc',
      label: 'Mayor precio',
      description: 'Productos con el precio más alto primero'
    },
    {
      value: 'name-asc',
      label: 'Nombre A-Z',
      description: 'Productos ordenados alfabéticamente'
    },
    {
      value: 'name-desc',
      label: 'Nombre Z-A',
      description: 'Productos ordenados alfabéticamente en reversa'
    },
  ];

  const currentOption = sortOptions.find(option => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-between w-full md:w-48", className)}
        >
          <span className="truncate">{currentOption?.label || 'Ordenar por'}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value ? "bg-accent text-accent-foreground" : ""}
          >
            <div>
              <div className="font-medium">{option.label}</div>
              {option.description && (
                <div className="text-xs text-muted-foreground">
                  {option.description}
                </div>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Status select dropdown component
 */
function ProductStatusSelect({ value, onChange, className = "" }: { value: string; onChange: (value: string) => void; className?: string }) {
  const t = useTranslations();
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'ACTIVE', label: t(PRODUCT_STATUS_MESSAGES.ACTIVE) },
    { value: 'DRAFT', label: t(PRODUCT_STATUS_MESSAGES.DRAFT) },
    { value: 'ARCHIVED', label: t(PRODUCT_STATUS_MESSAGES.ARCHIVED) },
  ];

  const currentOption = statusOptions.find(option => option.value === value) || statusOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-between w-full md:w-44", className)}
        >
          <span className="truncate">{currentOption.label}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value ? "bg-accent text-accent-foreground" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Product filters component with search, status, and sort
 */
export function ProductFilters({
  search,
  sort,
  status,
  onSearchChange,
  onSortChange,
  onStatusChange,
  onClearFilters,
  isPending: parentIsPending,
  className = ""
}: ProductFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [isPending, startTransition] = useTransition();

  // Optimistic states for immediate feedback
  const [optimisticSort, setOptimisticSort] = useOptimistic(sort);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);

  // Sync local search with prop when it changes externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        startTransition(() => {
          onSearchChange(localSearch);
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const handleSortChange = (newSort: string) => {
    startTransition(() => {
      setOptimisticSort(newSort);
      onSortChange(newSort);
    });
  };

  const handleStatusChange = (newStatus: string) => {
    startTransition(() => {
      setOptimisticStatus(newStatus);
      onStatusChange(newStatus);
    });
  };

  const activeFiltersCount = [
    search !== '',
    status !== '',
    sort !== 'createdAt-desc'
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1 md:max-w-md">
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors",
            (isPending || parentIsPending) && "text-primary animate-pulse"
          )} />
          <Input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 pr-10"
            aria-label="Buscar productos"
          />

          {localSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocalSearch("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <ProductStatusSelect
            value={optimisticStatus}
            onChange={handleStatusChange}
          />

          {/* Sort Dropdown */}
          <ProductSortSelect
            value={optimisticSort}
            onChange={handleSortChange}
          />

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-9 px-2 text-muted-foreground hover:text-primary"
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Active filters and status indicators */}
      {/* <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {hasActiveFilters && (
            <Badge variant="secondary" className="gap-1 px-2 py-1 font-medium">
              <Filter className="h-3 w-3" />
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro activo' : 'filtros activos'}
            </Badge>
          )}

          {(isPending || parentIsPending) && (
            <span className="text-xs text-muted-foreground animate-pulse flex items-center gap-1.5 ml-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              Actualizando...
            </span>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {hasActiveFilters ? (
            <span>Mostrando resultados filtrados</span>
          ) : (
            <span>Mostrando todos los productos</span>
          )}
        </div>
      </div> */}
    </div>
  );
}
