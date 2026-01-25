/**
 * Create Product Form Constants
 *
 * Constants for the multi-step product creation form.
 */

import type { CreateProductFormState } from '@/features/products/types';

/**
 * Total number of steps in the create product form
 *
 * Steps:
 * 1. Basic Info - name, description, slug, brand, status, SEO
 * 2. Media - product images
 * 3. Options/Variants - attributes and variant combinations
 * 4. Type Specific - physical vs digital product settings
 * 5. Configurations - inventory, pricing, promotions
 */
export const CREATE_PRODUCT_TOTAL_STEPS = 5;

/**
 * Initial form values for product creation
 */
export const CREATE_PRODUCT_INITIAL_VALUES: CreateProductFormState = {
  basicInfo: {
    name: "",
    description: "",
    slug: "",
    brand: "",
    status: "DRAFT",
    seoTitle: "",
    seoDescription: "",
    urlSlug: "",
    ogImageUrl: "",
  },
  media: {
    images: [],
  },
  variants: {
    hasVariants: false,
    options: [],
    variants: [],
  },
  configurations: {
    isDigital: false,
    trackInventory: true,
    isFeatured: false,
    isNew: true,
    isOnSale: false,
    allowPromotions: true,
    digital: null,
    physical: {
      weight: null,
      weightUnit: "kg",
      width: null,
      height: null,
      depth: null,
      dimensionUnit: "cm",
    },
  },
};
