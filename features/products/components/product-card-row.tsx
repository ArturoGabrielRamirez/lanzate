'use client';

import { Copy, Edit, MoreHorizontal, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/features/global/components/badge/badge';
import {
  BaseCard,
  BaseCardContent,
  BaseCardFooter,
  BaseCardHeader,
} from '@/features/global/components/base-card';
import { Button } from '@/features/global/components/button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/shadcn/components/ui/dropdown-menu';
import {
  INVENTORY_STATUS_MESSAGES,
  PRODUCT_STATUS_MESSAGES,
} from '@/features/products/constants';
import type { ProductCardRowProps } from '@/features/products/types';

/**
 * ProductCardRow Component
 *
 * Single product row using BaseCard with layout="row".
 * Displays product information in a table-like row format with:
 * - Checkbox for bulk selection
 * - Product image and name
 * - SKU with copy-to-clipboard
 * - Status badge
 * - Price display (with promotional pricing)
 * - Stock quantity and inventory status
 * - Action buttons (edit, more options)
 *
 * Follows the TableRows pattern from stories/base-card.stories.tsx
 */
export function ProductCardRow({
  product,
  isSelected,
  onToggleSelect,
  subdomain,
}: ProductCardRowProps) {
  // Status badge variant mapping
  const statusVariants = {
    ACTIVE: 'default',
    DRAFT: 'secondary',
    ARCHIVED: 'outline',
  } as const;

  // Calculate starting price from variants (stub for now, as variants aren't included)
  // In a full implementation, this would get the minimum variant price
  const startingPrice = 0; // Placeholder - will be calculated from variants

  // Calculate total stock (stub for now, as inventory isn't included)
  const totalStock = 0; // Placeholder - will be calculated from variant inventory

  // Determine inventory status
  const getInventoryStatus = (stock: number) => {
    if (stock === 0) return 'OUT_OF_STOCK';
    if (stock < 10) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  const inventoryStatus = getInventoryStatus(totalStock);

  const inventoryBadgeVariants = {
    IN_STOCK: 'default',
    LOW_STOCK: 'secondary',
    OUT_OF_STOCK: 'destructive',
  } as const;

  // Copy SKU to clipboard (stub - would need actual SKU from variant)
  const handleCopySKU = async () => {
    // In full implementation, copy the actual SKU
    // await navigator.clipboard.writeText(product.sku);
    console.log('Copy SKU functionality to be implemented');
  };

  // Handle dropdown actions
  const handleView = () => {
    console.log('View product:', product.id);
  };

  const handleDuplicate = () => {
    console.log('Duplicate product:', product.id);
  };

  const handleArchive = () => {
    console.log('Archive product:', product.id);
  };

  const handleDelete = () => {
    console.log('Delete product:', product.id);
  };

  return (
    <BaseCard
      layout="row"
      divided
      size="sm"
      variant="default"
      hover="default"
      columnGap="none"
    >
      {/* Column 1: Product info with checkbox, image, name, brand */}
      <BaseCardHeader
        icon={
          <div className="flex items-center gap-3">
            {/* Checkbox for bulk selection */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(product.id)}
              className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
              aria-label={`Select ${product.name}`}
            />

            {/* Product image or placeholder */}
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
              {/* TODO: Add actual product image when images relation is included */}
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        }
        title={product.name}
        description={product.brand || 'Sin marca'}
      />

      {/* Column 2: SKU with copy button */}
      <BaseCardContent className="flex items-center gap-2">
        <span className="text-sm text-foreground">
          {/* TODO: Display actual SKU from variant */}
          SKU-XXX
        </span>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={handleCopySKU}
          aria-label="Copiar SKU"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </BaseCardContent>

      {/* Column 3: Status badge */}
      <BaseCardContent className="flex items-center">
        <Badge variant={statusVariants[product.status]} size="sm">
          {PRODUCT_STATUS_MESSAGES[product.status].es}
        </Badge>
      </BaseCardContent>

      {/* Column 4: Price display */}
      <BaseCardContent className="flex flex-col">
        {/* TODO: Add promotional price display when available */}
        <span className="text-sm font-semibold">
          ${startingPrice.toFixed(2)}
        </span>
        {/* Example of promotional price display (when available):
        {product.promotionalPrice && (
          <span className="text-xs text-muted-foreground line-through">
            ${product.price.toFixed(2)}
          </span>
        )}
        */}
      </BaseCardContent>

      {/* Column 5: Stock quantity and status */}
      <BaseCardContent className="flex flex-col gap-1">
        <span className="text-sm text-foreground">{totalStock} unidades</span>
        <Badge variant={inventoryBadgeVariants[inventoryStatus]} size="sm">
          {INVENTORY_STATUS_MESSAGES[inventoryStatus].es}
        </Badge>
      </BaseCardContent>

      {/* Column 6 (Footer): Actions */}
      <BaseCardFooter align="end" className="w-auto flex-none gap-2">
        {/* Edit button */}
        <Button
          size="sm"
          variant="outline"
          asChild
        >
          <Link href={`/app/es/stores/${subdomain}/products/${product.id}/edit`}>
            <Edit className="mr-1.5 h-3.5 w-3.5" />
            Editar
          </Link>
        </Button>

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost" aria-label="Más acciones">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView}>
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleArchive}>
              Archivar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BaseCardFooter>
    </BaseCard>
  );
}
