'use client';

import { Copy, Edit, MoreHorizontal, Package } from 'lucide-react';
import NextImage from 'next/image';
import { useTranslations } from 'next-intl';
/* import Link from 'next/link'; */

import { Badge } from '@/features/global/components/badge/badge';
import {
  BaseCard,
  BaseCardContent,
  BaseCardFooter,
  BaseCardHeader,
} from '@/features/global/components/base-card';
import { Button } from '@/features/global/components/button/button';
import {
  INVENTORY_STATUS_MESSAGES,
  PRODUCT_STATUS_MESSAGES,
} from '@/features/products/constants';
import type { ProductCardRowProps } from '@/features/products/types';
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerGroup,
  DropDrawerItem,
  DropDrawerSeparator,
  DropDrawerTrigger,
} from '@/features/shadcn/components/ui/dropdrawer';

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
  /* subdomain, */
}: ProductCardRowProps) {
  const t = useTranslations();
  // Status badge variant mapping
  const statusVariants = {
    ACTIVE: 'default',
    DRAFT: 'outline',
    ARCHIVED: 'outline',
  } as const;

  // Calculate starting price from variants
  const startingPrice = product.variants.length > 0
    ? Math.min(...product.variants.map(v => Number(v.price)))
    : 0;

  // Calculate total stock (sum of all variant inventory - requires inventory relation which is not yet included)
  // For now we use 0 as we don't have inventory info in ProductListItem, 
  // but we can at least show that we are ready for it.
  const totalStock = 0;

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
      hover="primary"
      columnGap="none"
      className='rounded-lg'
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
              {product.images?.[0] ? (
                <NextImage
                  src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
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
      <BaseCardContent className="flex items-center justify-center">
        <Badge variant={statusVariants[product.status]} size="sm">
          {t(PRODUCT_STATUS_MESSAGES[product.status])}
        </Badge>
      </BaseCardContent>

      {/* Column 4: Price display */}
      <BaseCardContent className="flex flex-col">
        {startingPrice > 0 ? (
          <span className="text-sm font-semibold">
            ${startingPrice.toFixed(2)}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </BaseCardContent>

      {/* Column 5: Stock quantity and status */}
      <BaseCardContent className="flex items-center justify-center">
        {inventoryStatus === 'OUT_OF_STOCK' ? (
          <Badge variant="destructive" size="sm">
            {t(INVENTORY_STATUS_MESSAGES.OUT_OF_STOCK)}
          </Badge>
        ) : (
          <>
            <span className="text-sm text-foreground">{totalStock} uds.</span>
            {inventoryStatus === 'LOW_STOCK' && (
              <Badge variant={inventoryBadgeVariants.LOW_STOCK} size="sm">
                {t(INVENTORY_STATUS_MESSAGES.LOW_STOCK)}
              </Badge>
            )}
          </>
        )}
      </BaseCardContent>

      {/* Column 6 (Footer): Actions */}
      <BaseCardFooter align="end" className="w-auto flex-none gap-2">
        {/* Edit button */}
        <Button
          size="icon"
          variant="outline"
          asChild
        >
          <Edit />
        </Button>

        {/* More actions dropdrawer */}
        <DropDrawer>
          <DropDrawerTrigger asChild>
            <Button size="icon" variant="outline" aria-label="Más acciones">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropDrawerTrigger>
          <DropDrawerContent>
            <DropDrawerGroup>
              <DropDrawerItem onClick={handleView}>Ver detalles</DropDrawerItem>
              <DropDrawerItem onClick={handleDuplicate}>Duplicar</DropDrawerItem>
            </DropDrawerGroup>
            <DropDrawerSeparator />
            <DropDrawerGroup>
              <DropDrawerItem onClick={handleArchive}>Archivar</DropDrawerItem>
              <DropDrawerItem variant="destructive" onClick={handleDelete}>Eliminar</DropDrawerItem>
            </DropDrawerGroup>
          </DropDrawerContent>
        </DropDrawer>
      </BaseCardFooter>
    </BaseCard>
  );
}
