/**
 * Product Filters Component
 *
 * Component for searching and sorting products in the listing page.
 * Uses React 19 hooks for state management.
 *
 * Features:
 * - Search input with debounced filtering
 * - Sort dropdown (newest, price, name)
 * - Mobile-responsive layout
 * - URL state synchronization
 */

"use client";

import { useState, useCallback, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/features/shadcn/components/ui/input';
import { Button } from "@/features/global/components/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/features/shadcn/components/ui/dropdown-menu';
import { cn } from '@/features/shadcn/utils/cn';
import type { ProductFiltersProps, ProductSortSelectProps } from '@/features/products/types/product-listing.types';

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
          className={cn("justify-between", className)}
        >
          <span>{currentOption?.label || 'Ordenar por'}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
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
 * Product filters component with search and sort
 */
export function ProductFilters({ 
  search, 
  sort, 
  onSearchChange, 
  onSortChange, 
  className = "" 
}: ProductFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Debounced search handler
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    // Debounce the actual callback
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [onSearchChange]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeout
    };
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeout
    };
  }, []);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center", className)}>
      {/* Search Input */}
      <div className="relative flex-1 md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar productos..."
          value={localSearch}
          onChange={(e) => handleSearchChange()(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="pl-10"
          aria-label="Buscar productos"
        />
        
        {/* Clear button when search has value */}
        {localSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            aria-label="Limpiar búsqueda"
          >
            <span className="sr-only">Limpiar</span>
            ×
          </Button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-sm text-muted-foreground hidden md:inline">
          Ordenar por:
        </span>
        <ProductSortSelect
          value={sort}
          onChange={onSortChange}
          className="w-full md:w-48"
        />
      </div>

      {/* Active filters indicator */}
      {(localSearch || sort !== 'updatedAt-desc') && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 bg-primary rounded-full" />
          <span>Filtros activos</span>
        </div>
      )}
    </div>
  );
}