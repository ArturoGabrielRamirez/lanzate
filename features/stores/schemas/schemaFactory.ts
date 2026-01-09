/**
 * Store Schema Factory Functions
 *
 * This file contains factory functions that create Yup validation schemas
 * with internationalized error messages. Each factory accepts a translation
 * function and returns a fully configured schema with translated validation errors.
 *
 * This approach enables dynamic validation messages based on the user's locale
 * while maintaining type safety and reusability.
 *
 * Usage in Client Components:
 * ```tsx
 * import { useTranslations } from 'next-intl';
 * import { createStoreSchema } from '@/features/stores/schemas/schemaFactory';
 *
 * const t = useTranslations();
 * const storeSchema = createStoreSchema((key) => t(key));
 * ```
 */

import * as yup from 'yup';

/**
 * Translation function type
 * Accepts a translation key and returns the translated string
 */
type TranslationFunction = (key: string) => string;

/**
 * Store Schema Factory
 *
 * Creates a store validation schema with translated error messages.
 * Validates store creation with:
 * - name: required, 1-100 characters, trimmed
 * - description: optional, max 500 characters, trimmed
 * - subdomain: required, lowercase, alphanumeric + hyphens only, 3-63 characters, trimmed
 *
 * @param t - Translation function
 * @returns Configured store validation schema
 *
 * @example
 * ```tsx
 * const t = useTranslations();
 * const schema = createStoreSchema((key) => t(key));
 * const resolver = yupResolver(schema);
 * ```
 */
export const createStoreSchema = (t: TranslationFunction) =>
  yup.object({
    name: yup
      .string()
      .required(t('validation.store.name.required'))
      .min(1, t('validation.store.name.min'))
      .max(100, t('validation.store.name.max'))
      .trim(),
    description: yup
      .string()
      .max(500, t('validation.store.description.max'))
      .trim()
      .default(undefined),
    subdomain: yup
      .string()
      .required(t('validation.store.subdomain.required'))
      .lowercase()
      .matches(/^[a-z0-9-]+$/, t('validation.store.subdomain.format'))
      .min(3, t('validation.store.subdomain.min'))
      .max(63, t('validation.store.subdomain.max'))
      .trim(),
  });

/**
 * Inferred TypeScript types from factory schemas
 *
 * These types are automatically generated from the Yup schemas
 * and ensure type safety when using these schemas in forms
 * and server actions.
 *
 * Note: Since factories return schemas dynamically, we infer types
 * from a dummy translation function for type consistency.
 */
//const dummyT = (key: string) => key;

export type CreateStoreInput = yup.InferType<ReturnType<typeof createStoreSchema>>;
