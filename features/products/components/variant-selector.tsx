/**
 * Variant Selector Component
 *
 * Interactive component for selecting product variants.
 * Uses React 19 hooks for state management and variant handling.
 *
 * Features:
 * - Grouped attribute display (Size, Color, etc.)
 * - Price updates on variant change
 * - Inventory status display
 * - Disabled unavailable combinations
 */

"use client";

import { useState, useCallback, useMemo } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/features/shadcn/utils/cn';
import type { 
  VariantSelectorProps, 
  VariantOptionProps,
  VariantAttributeGroup,
  VariantWithRelations 
} from '@/features/products/types/product-detail.types';

/**
 * Individual variant option button
 */
function VariantOption({ 
  value, 
  selected, 
  disabled = false, 
  type = 'TEXT',
  onClick 
}: VariantOptionProps) {
  const baseClasses = "px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20";
  
  const typeClasses = useMemo(() => {
    switch (type) {
      case 'COLOR':
        return "w-8 h-8 p-0 border-2";
      case 'IMAGE':
        return "w-12 h-12 p-1";
      default:
        return baseClasses;
    }
  }, [type]);

  return (
    <button
      className={cn(
        typeClasses,
        selected 
          ? "border-primary bg-primary text-primary-foreground" 
          : "border-muted-foreground/20 bg-card hover:border-muted-foreground/40 hover:bg-muted",
        disabled && "opacity-50 cursor-not-allowed hover:border-muted-foreground/20"
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Seleccionar ${value}`}
      aria-pressed={selected}
    >
      {type === 'COLOR' ? (
        <div 
          className="h-full w-full rounded-sm"
          style={{ backgroundColor: value }}
          title={value}
        />
      ) : type === 'IMAGE' ? (
        <img 
          src={value} 
          alt={value}
          className="h-full w-full rounded-sm object-cover"
        />
      ) : (
        <span>{value}</span>
      )}
    </button>
  );
}

/**
 * Variant selector with grouped attributes
 */
export function VariantSelector({ 
  variants, 
  onVariantChange, 
  className = "" 
}: VariantSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState(() => variants[0]);

  // Group attributes by name for display
  const attributeGroups = useMemo(() => {
    const groups: VariantAttributeGroup[] = [];
    
    if (!variants || variants.length === 0) return groups;
    const firstVariant = variants[0] as any;
    if (!firstVariant?.attributeValues) return groups;

    // Collect all unique attribute names
    const attributeNames = Array.from(
      new Set(
        variants.flatMap(v => (v.attributeValues || []).map(av => av.attribute.name))
      )
    );

    // For each attribute name, collect all possible values
    attributeNames.forEach(attrName => {
      const values = Array.from(
        new Set(
          variants
            .flatMap(v => v.attributeValues || [])
            .filter(av => av.attribute.name === attrName)
            .map(av => av.value)
        )
      );

      // Find attribute type from first variant that has this attribute
      const attributeType = variants.find(v => 
        (v.attributeValues || []).some(av => av.attribute.name === attrName)
      )?.attributeValues?.find(av => av.attribute.name === attrName)?.attribute.type || 'TEXT';

      groups.push({
        attributeName: attrName,
        attributeType: attributeType as 'TEXT' | 'NUMBER' | 'COLOR' | 'IMAGE',
        values
      });
    });

    return groups;
  }, [variants]);

  // Check if a specific attribute combination is available
  const isCombinationAvailable = useCallback((
    attributeName: string, 
    attributeValue: string,
    currentSelections: Record<string, string>
  ): boolean => {
    const testSelections = { ...currentSelections, [attributeName]: attributeValue };
    
    // Find variant with this combination
    const matchingVariant = variants.find(variant => {
      return Object.entries(testSelections).every(([name, value]) =>
        (variant.attributeValues || []).some(av =>
          av.attribute.name === name && av.value === value
        )
      );
    });

    return !!matchingVariant;
  }, [variants]);

  // Handle attribute selection
  const handleAttributeChange = useCallback((
    attributeName: string, 
    value: string
  ) => {
    const newSelections = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newSelections);

  // Find matching variant
    const matchingVariant = variants.find(variant =>
      Object.entries(newSelections).every(([name, value]) =>
        (variant.attributeValues || []).some(av =>
          av.attribute.name === name && av.value === value
        )
      )
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      onVariantChange(matchingVariant);
    }
  }, [selectedAttributes, variants, onVariantChange]);

  // Get inventory status for selected variant
  const inventoryStatus = useMemo(() => {
    if (!selectedVariant?.inventory || selectedVariant.inventory.length === 0) {
      return { available: false, quantity: 0 };
    }

    const totalQuantity = selectedVariant.inventory.reduce(
      (sum: number, inv) => sum + inv.quantity, 0
    );

    const lowStockThreshold = selectedVariant.inventory[0]?.lowStockThreshold || 10;
    const isLowStock = totalQuantity <= lowStockThreshold;

    return {
      available: totalQuantity > 0,
      quantity: totalQuantity,
      isLowStock
    };
  }, [selectedVariant]);

  const isSelected = useCallback((attributeName: string, value: string) => {
    return selectedAttributes[attributeName] === value;
  }, [selectedAttributes]);

  if (!variants || variants.length === 0) {
    return null;
  }

  // If only one variant, don't show selector
  if (variants.length === 1) {
    return (
      <div className={className}>
        <input
          type="hidden"
          name="variantId"
          value={selectedVariant.id}
          readOnly
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        type="hidden"
        name="variantId"
        value={selectedVariant.id}
        readOnly
      />
      
      <div className="space-y-4">
        {attributeGroups.map((group) => (
          <div key={group.attributeName}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {group.attributeName}
            </label>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => (
                <VariantOption
                  key={value}
                  value={value}
                  type={group.attributeType}
                  selected={isSelected(group.attributeName, value)}
                  disabled={!isCombinationAvailable(group.attributeName, value, selectedAttributes)}
                  onClick={() => handleAttributeChange(group.attributeName, value)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Inventory Status */}
        <div className="mt-4 text-sm">
          {inventoryStatus.available ? (
            inventoryStatus.isLowStock ? (
              <p className="text-amber-600 dark:text-amber-400">
                ✓ Solo quedan {inventoryStatus.quantity} unidades
              </p>
            ) : (
              <p className="text-green-600 dark:text-green-400">
                ✓ En stock ({inventoryStatus.quantity} unidades disponibles)
              </p>
            )
          ) : (
            <p className="text-red-600 dark:text-red-400">
              ✗ Sin stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}