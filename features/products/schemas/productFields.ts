/**
 * Reusable Product Field Validators
 *
 * This file contains base validation rules for individual fields
 * used across multiple product schemas. By extracting these
 * as reusable validators, we follow DRY principles and ensure
 * consistent validation rules across all product operations.
 *
 * These fields are composed into complete schemas in product.schema.ts
 */

import { ProductStatus } from '@prisma/client';
import * as yup from 'yup';

/**
 * Text fields
 */

export const nameField = yup
  .string()
  .min(1, 'El nombre es obligatorio')
  .max(200, 'El nombre no puede exceder 200 caracteres')
  .trim();

export const descriptionField = yup
  .string()
  .max(2000, 'La descripción no puede exceder 2000 caracteres')
  .trim();

export const slugField = yup
  .string()
  .matches(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones')
  .min(1, 'El slug es obligatorio')
  .max(100, 'El slug no puede exceder 100 caracteres')
  .lowercase()
  .trim();

export const brandField = yup
  .string()
  .max(100, 'La marca no puede exceder 100 caracteres')
  .trim();

/**
 * SEO fields
 */

export const seoTitleField = yup
  .string()
  .max(60, 'El título SEO no puede exceder 60 caracteres')
  .trim();

export const seoDescriptionField = yup
  .string()
  .max(160, 'La descripción SEO no puede exceder 160 caracteres')
  .trim();

/**
 * URL fields
 */

export const urlField = yup
  .string()
  .url('URL inválida');

/**
 * Price fields
 */

export const priceField = yup
  .number()
  .typeError('El precio debe ser un número')
  .positive('El precio debe ser mayor a 0')
  .max(999999.99, 'El precio no puede exceder 999,999.99');

export const promotionalPriceField = yup
  .number()
  .typeError('El precio promocional debe ser un número')
  .positive('El precio promocional debe ser mayor a 0')
  .test('less-than-regular', 'El precio promocional debe ser menor al precio regular', function(value) {
    const { price } = this.parent;
    return !value || !price || value < price;
  });

/**
 * Variant fields
 */

export const skuField = yup
  .string()
  .matches(/^[A-Z0-9-]+$/, 'El SKU solo puede contener mayúsculas, números y guiones')
  .min(1, 'El SKU es obligatorio')
  .max(50, 'El SKU no puede exceder 50 caracteres')
  .trim();

/**
 * Enum field
 */

export const productStatusField = yup
  .mixed<ProductStatus>()
  .oneOf(Object.values(ProductStatus), 'Estado de producto inválido');