/**
 * Product Validation Schemas
 *
 * This file composes complete validation schemas for all product
 * use cases by combining reusable field validators from productFields.ts.
 *
 * Each schema is tailored to its specific use case:
 * - productBasicInfoSchema: Basic product information and SEO fields
 * - productMediaSchema: Product images validation with ordering
 * - productVariantSchema: Variant pricing and attribute validation
 * - productConfigSchema: Digital products and inventory configuration
 *
 * Types are automatically inferred from schemas using yup.InferType
 * to ensure type safety across the application.
 */

import * as yup from 'yup';

import {
  nameField,
  descriptionField,
  slugField,
  brandField,
  seoTitleField,
  seoDescriptionField,
  urlField,
  priceField,
  promotionalPriceField,
  skuField,
  productStatusField,
} from '@/features/products/schemas/productFields';

/**
 * Product Basic Info Schema
 *
 * Validates basic product information including:
 * - Name, description, slug, brand (main product fields)
 * - Status and boolean flags (product state and features)
 * - SEO fields (title and description for search optimization)
 * - Additional URLs (custom slug and Open Graph image)
 */
export const productBasicInfoSchema = yup.object({
  name: nameField.required('El nombre del producto es obligatorio'),
  description: descriptionField.optional(),
  slug: slugField.required('El slug es obligatorio'),
  brand: brandField.optional(),
  status: productStatusField.default('DRAFT'),
  isDigital: yup.boolean().default(false),
  isFeatured: yup.boolean().default(false),
  isNew: yup.boolean().default(false),
  isOnSale: yup.boolean().default(false),
  allowPromotions: yup.boolean().default(true),
  trackInventory: yup.boolean().default(true),
  // SEO fields
  seoTitle: seoTitleField.optional(),
  seoDescription: seoDescriptionField.optional(),
  urlSlug: urlField.optional(),
  ogImageUrl: urlField.optional(),
});

/**
 * Product Media Schema
 *
 * Validates product images with:
 * - URL validation for each image
 * - Alt text with character limit for accessibility
 * - Position field for image ordering
 * - Single primary image validation
 * - Minimum one image requirement
 */
export const productMediaSchema = yup.object({
  images: yup.array().of(
    yup.object({
      id: yup.string().optional(),
      url: urlField.required('La URL de la imagen es obligatoria'),
      altText: yup.string().max(200, 'El texto alt no puede exceder 200 caracteres').optional(),
      position: yup.number().integer().min(0).default(0),
      isPrimary: yup.boolean().default(false),
    })
  ).min(1, 'Debes agregar al menos una imagen')
  .test('unique-primary', 'Solo puede haber una imagen primaria', function(images) {
    const primaryImages = images?.filter(img => img.isPrimary) || [];
    return primaryImages.length <= 1;
  }),
});

/**
 * Product Variant Schema
 *
 * Validates product variants with:
 * - SKU with format validation (uppercase, numbers, hyphens)
 * - Required price, optional promotional price and cost
 * - Promotional price must be less than regular price
 * - Attribute values linking (at least one attribute required)
 */
export const productVariantSchema = yup.object({
  sku: skuField.required('El SKU es obligatorio'),
  price: priceField.required('El precio es obligatorio'),
  promotionalPrice: promotionalPriceField.optional(),
  cost: priceField.optional(),
  attributeValues: yup.array().of(
    yup.object({
      attributeId: yup.string().required('El ID del atributo es obligatorio'),
      valueId: yup.string().required('El ID del valor es obligatorio'),
    })
  ).min(1, 'La variante debe tener al menos un atributo'),
});

/**
 * Product Config Schema
 *
 * Validates product-specific configurations:
 * - isDigital flag for digital vs physical products
 * - trackInventory for stock management preference
 * - Digital product-specific fields (conditional validation)
 * - File information for digital downloads
 * - Download limits and expiration for security
 */
export const productConfigSchema = yup.object({
  isDigital: yup.boolean().default(false),
  trackInventory: yup.boolean().default(true),
  // Digital product specific - conditional validation
  digitalProduct: yup.object().when('isDigital', {
    is: true,
    then: (schema) => schema.shape({
      downloadUrl: urlField.required('La URL de descarga es obligatoria'),
      fileName: yup.string()
        .min(1, 'El nombre del archivo es obligatorio')
        .max(255, 'El nombre del archivo no puede exceder 255 caracteres')
        .required(),
      fileType: yup.string()
        .matches(/^[a-z0-9\/]+$/, 'Tipo de archivo inválido')
        .required(),
      fileSize: yup.number()
        .positive('El tamaño del archivo debe ser positivo')
        .required('El tamaño del archivo es obligatorio'),
      expirationDate: yup.date().nullable().optional(),
      downloadLimit: yup.number()
        .integer('El límite de descarga debe ser un número entero')
        .min(1, 'El límite de descarga debe ser al menos 1')
        .optional(),
    }).required('Los campos del producto digital son obligatorios'),
    otherwise: (schema) => schema.optional().strip(),
  }),
});

/**
 * Inferred TypeScript types from schemas
 *
 * These types are automatically generated from Yup schemas
 * and ensure type safety when using these schemas in forms
 * and server actions
 */
export type ProductBasicInfoInput = yup.InferType<typeof productBasicInfoSchema>;
export type ProductMediaInput = yup.InferType<typeof productMediaSchema>;
export type ProductVariantInput = yup.InferType<typeof productVariantSchema>;
export type ProductConfigInput = yup.InferType<typeof productConfigSchema>;