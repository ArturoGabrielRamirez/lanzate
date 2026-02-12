/**
 * Variant Combination Generator
 *
 * Generates all possible variant combinations from product options
 * using a cartesian product algorithm.
 */

import { v4 as uuidv4 } from "uuid";

import type {
  CreateProductOption,
  CreateProductOptionValue,
  CreateProductVariantForm,
} from "@/features/products/types";

/**
 * Generate all possible variant combinations from options
 *
 * Takes an array of product options (e.g., Size with [S, M, L] and Color with [Red, Blue])
 * and generates all possible combinations as variant forms.
 *
 * @param options - Array of product options with their values
 * @returns Array of variant form objects with combination metadata
 */
export function generateVariantCombinations(
  options: CreateProductOption[]
): CreateProductVariantForm[] {
  if (options.length === 0 || options.some((opt) => opt.values.length === 0)) {
    return [];
  }

  // Get all value combinations using cartesian product
  const valueCombinations = options.reduce<CreateProductOptionValue[][]>(
    (acc, option) => {
      if (acc.length === 0) {
        return option.values.map((v) => [v]);
      }
      const newCombinations: CreateProductOptionValue[][] = [];
      for (const combo of acc) {
        for (const value of option.values) {
          newCombinations.push([...combo, value]);
        }
      }
      return newCombinations;
    },
    []
  );

  // Create variants from combinations
  return valueCombinations.map((combo) => ({
    id: uuidv4(),
    sku: "",
    price: 0,
    promotionalPrice: null,
    cost: null,
    attributeValueIds: combo.map((v) => v.id),
    attributeCombination: combo.map((v) => v.value).join(" / "),
    isEnabled: true,
  }));
}
