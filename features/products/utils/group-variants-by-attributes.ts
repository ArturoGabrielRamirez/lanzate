/**
 * Group Variants by Attributes Utility
 *
 * Utility function to group product variants by their attributes
 * for display in variant selector component.
 */

import type { ProductVariant } from '@prisma/client';
import type { VariantAttributeGroup } from '@/features/products/types/product-detail.types';

/**
 * Group variants by their attribute values
 *
 * Takes a list of variants and organizes them by attribute names
 * to create a structured display for variant selection.
 *
 * @param variants - Array of product variants with their attribute values
 * @returns Array of attribute groups with their possible values
 *
 * @example
 * const variants = [
 *   { sku: 'TSHIRT-RED-S', attributeValues: [{ attribute: { name: 'Color' }, value: 'Red' }] },
 *   { sku: 'TSHIRT-BLUE-S', attributeValues: [{ attribute: { name: 'Color' }, value: 'Blue' }] }
 * ];
 * const groups = groupVariantsByAttributes(variants);
 * // Returns: [{ attributeName: 'Color', values: ['Red', 'Blue'] }]
 */
export function groupVariantsByAttributes(
  variants: (ProductVariant & {
    attributeValues: {
      attribute: {
        name: string;
        type: 'TEXT' | 'NUMBER' | 'COLOR' | 'IMAGE';
      };
      value: string;
    }[];
  })[]
): VariantAttributeGroup[] {
  if (!variants || variants.length === 0) {
    return [];
  }

  // Collect all unique attribute names and their values
  const attributeMap = new Map<string, Set<string>>();

  variants.forEach((variant) => {
    variant.attributeValues.forEach((attrValue) => {
      const attributeName = attrValue.attribute.name;
      const attributeType = attrValue.attribute.type;
      const value = attrValue.value;

      if (!attributeMap.has(attributeName)) {
        attributeMap.set(attributeName, new Set());
      }
      attributeMap.get(attributeName)!.add(value);
    });
  });

  // Convert to array format expected by component
  return Array.from(attributeMap.entries()).map(([attributeName, values]) => {
    // Find the type from first variant that has this attribute
    const firstVariant = variants.find(v => 
      v.attributeValues.some(av => av.attribute.name === attributeName)
    );
    const attributeType = firstVariant?.attributeValues.find(
      av => av.attribute.name === attributeName
    )?.attribute.type || 'TEXT';

    return {
      attributeName,
      attributeType: attributeType as 'TEXT' | 'NUMBER' | 'COLOR' | 'IMAGE',
      values: Array.from(values),
    };
  });
}

/**
 * Find variant by selected attribute combination
 *
 * Takes selected attribute values and finds the matching variant.
 * Returns null if no exact match is found.
 *
 * @param variants - Array of all available variants
 * @param selectedAttributes - Object with selected attribute names and values
 * @returns Matching variant or null
 */
export function findVariantByAttributes(
  variants: (ProductVariant & {
    attributeValues: {
      attribute: { name: string };
      value: string;
    }[];
  })[],
  selectedAttributes: Record<string, string>
): ProductVariant | null {
  return variants.find((variant) => {
    // Check if all selected attributes match this variant
    return Object.entries(selectedAttributes).every(([attrName, attrValue]) => {
      return variant.attributeValues.some(
        (av) => av.attribute.name === attrName && av.value === attrValue
      );
    });
  }) || null;
}