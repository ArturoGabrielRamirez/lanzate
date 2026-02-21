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
 * - productAttributeSchema: Product attribute creation
 * - inventoryUpdateSchema: Inventory update operations
 * - reviewSchema: Product review validation
 * - bundleSchema: Product bundle creation
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
  quantityField,
  lowStockThresholdField,
  ratingField,
  reviewTitleField,
  reviewBodyField,
  attributeTypeField,
} from '@/features/products/schemas/productFields';

/**
 * Product Basic Info Schema
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
  seoTitle: seoTitleField.optional(),
  seoDescription: seoDescriptionField.optional(),
  urlSlug: urlField.optional(),
  ogImageUrl: urlField.optional(),
});

/**
 * Product Media Schema
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
    .test('unique-primary', 'Solo puede haber una imagen primaria', function (images) {
      const primaryImages = images?.filter(img => img.isPrimary) || [];
      return primaryImages.length <= 1;
    }),
});

/**
 * Product Variant Schema
 */
export const productVariantSchema = yup.object({
  sku: skuField.required('El SKU es obligatorio'),
  price: priceField.required('El precio es obligatorio'),
  promotionalPrice: promotionalPriceField.optional(),
  cost: priceField.optional(),
  attributeValueIds: yup.array()
    .of(yup.string().required('El ID del valor de atributo es obligatorio'))
    .min(1, 'La variante debe tener al menos un valor de atributo'),
});

/**
 * Product Config Schema
 */
export const productConfigSchema = yup.object({
  isDigital: yup.boolean().default(false),
  trackInventory: yup.boolean().default(true),
  digitalProduct: yup.object().when('isDigital', {
    is: true,
    then: (schema) => schema.shape({
      downloadUrl: urlField.required('La URL de descarga es obligatoria'),
      fileName: yup.string().min(1).max(255).required(),
      fileType: yup.string().matches(/^[a-z0-9\/]+$/, 'Tipo de archivo invalido').required(),
      fileSize: yup.number().positive().required('El tamano del archivo es obligatorio'),
      expirationDate: yup.date().nullable().optional(),
      downloadLimit: yup.number().integer().min(1).optional(),
    }).required('Los campos del producto digital son obligatorios'),
    otherwise: (schema) => schema.optional().strip(),
  }),
});

/**
 * Product Attribute Schema
 */
export const productAttributeSchema = yup.object({
  name: nameField.required('El nombre del atributo es obligatorio'),
  type: attributeTypeField.required('El tipo de atributo es obligatorio'),
  values: yup.array()
    .of(yup.string().trim().min(1, 'El valor no puede estar vacio'))
    .min(1, 'El atributo debe tener al menos un valor'),
});

/**
 * Inventory Update Schema
 */
export const inventoryUpdateSchema = yup.object({
  variantId: yup.string().required('El ID de la variante es obligatorio'),
  branchId: yup.string().required('El ID de la sucursal es obligatorio'),
  quantity: quantityField.required('La cantidad es obligatoria'),
  lowStockThreshold: lowStockThresholdField.optional(),
});

/**
 * Review Schema
 */
export const reviewSchema = yup.object({
  productId: yup.string().required('El ID del producto es obligatorio'),
  orderItemId: yup.string().required('El ID del item de orden es obligatorio'),
  rating: ratingField.required('La calificacion es obligatoria'),
  title: reviewTitleField.required('El titulo es obligatorio'),
  body: reviewBodyField.optional(),
});

/**
 * Bundle Item Schema
 */
const bundleItemSchema = yup.object({
  productId: yup.string().required('El ID del producto es obligatorio'),
  variantId: yup.string().optional(),
  quantity: yup.number().integer().min(1).default(1),
});

/**
 * Bundle Schema
 */
export const bundleSchema = yup.object({
  name: nameField.required('El nombre del bundle es obligatorio'),
  description: descriptionField.optional(),
  price: priceField.required('El precio del bundle es obligatorio'),
  isActive: yup.boolean().default(true),
  items: yup.array().of(bundleItemSchema).min(2, 'El bundle debe tener al menos 2 productos').required('Los productos son obligatorios'),
});

/**
 * Delete Bundle Schema
 */
export const deleteBundleSchema = yup.object({
  id: yup.string().required('ID del paquete es requerido'),
});

/**
 * Update Bundle Schema
 */
export const updateBundleSchema = yup.object({
  id: yup.string().required('ID del paquete es requerido'),
  name: yup.string().required('Nombre es requerido'),
  description: yup.string().optional(),
  price: yup.number().positive('Precio debe ser positivo').required('Precio es requerido'),
  isActive: yup.boolean().required('Estado activo es requerido'),
  items: yup
    .array()
    .of(
      yup.object({
        productId: yup.string().required('ID del producto es requerido'),
        variantId: yup.string().optional(),
        quantity: yup
          .number()
          .integer()
          .positive('Cantidad debe ser positiva')
          .required('Cantidad es requerida'),
      })
    )
    .min(2, 'El paquete debe contener al menos 2 productos')
    .required('Items son requeridos'),
});

/**
 * Get Download URL Schema
 */
export const getDownloadUrlSchema = yup.object({
  productId: yup.string().required('ID del producto es requerido'),
  orderItemId: yup.string().required('ID del artículo de pedido es requerido'),
});

/**
 * Inferred TypeScript types from schemas
 */
export type ProductBasicInfoInput = yup.InferType<typeof productBasicInfoSchema>;
export type ProductMediaInput = yup.InferType<typeof productMediaSchema>;
export type ProductVariantInput = yup.InferType<typeof productVariantSchema>;
export type ProductConfigInput = yup.InferType<typeof productConfigSchema>;
export type ProductAttributeInput = yup.InferType<typeof productAttributeSchema>;
export type InventoryUpdateInput = yup.InferType<typeof inventoryUpdateSchema>;
export type ReviewInput = yup.InferType<typeof reviewSchema>;
export type BundleItemInput = yup.InferType<typeof bundleItemSchema>;
export type BundleInput = yup.InferType<typeof bundleSchema>;
