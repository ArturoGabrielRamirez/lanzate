// Category type definition for store-landing feature

/**
 * Represents a product category.
 */
export type Category = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  slug: string;
}; 