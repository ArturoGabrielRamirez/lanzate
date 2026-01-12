/**
 * Billing Validation Schemas
 *
 * This file defines Yup validation schemas for billing feature inputs.
 * Schemas validate server action inputs and provide type inference.
 *
 * Following the pattern from auth.schema.ts - define reusable field validators
 * that compose into use-case specific schemas.
 */

import { PaymentStatus } from '@prisma/client';
import * as yup from 'yup';

/**
 * Valid payment status values for filtering
 */
const validPaymentStatuses = Object.values(PaymentStatus);

/**
 * Payment Filters Schema
 *
 * Validates input for getBillingHistoryAction:
 * - page: positive integer, defaults to 1
 * - pageSize: positive integer between 1-100, defaults to 10
 * - status: optional, must be valid PaymentStatus enum value
 * - dateFrom: optional date for range start
 * - dateTo: optional date for range end
 */
export const paymentFiltersSchema = yup.object({
  page: yup
    .number()
    .integer('La pagina debe ser un numero entero')
    .positive('La pagina debe ser positiva')
    .default(1),
  pageSize: yup
    .number()
    .integer('El tamano de pagina debe ser un numero entero')
    .min(1, 'El tamano de pagina minimo es 1')
    .max(100, 'El tamano de pagina maximo es 100')
    .default(10),
  status: yup
    .mixed<PaymentStatus>()
    .oneOf(
      [...validPaymentStatuses, undefined],
      'Estado de pago invalido'
    )
    .optional(),
  dateFrom: yup
    .date()
    .optional()
    .nullable()
    .transform((value, originalValue) => {
      // Handle string dates from URL params
      if (originalValue === '' || originalValue === null) return undefined;
      return value;
    }),
  dateTo: yup
    .date()
    .optional()
    .nullable()
    .transform((value, originalValue) => {
      // Handle string dates from URL params
      if (originalValue === '' || originalValue === null) return undefined;
      return value;
    })
    .test(
      'date-range',
      'La fecha final debe ser posterior a la fecha inicial',
      function (dateTo) {
        const { dateFrom } = this.parent;
        if (!dateFrom || !dateTo) return true;
        return dateTo >= dateFrom;
      }
    ),
});

/**
 * Subscription ID Schema
 *
 * Validates subscription ID input for actions
 */
export const subscriptionIdSchema = yup
  .string()
  .required('El ID de suscripcion es obligatorio')
  .trim();

/**
 * Payment ID Schema
 *
 * Validates payment ID input for actions
 */
export const paymentIdSchema = yup
  .string()
  .required('El ID de pago es obligatorio')
  .trim();

/**
 * Inferred TypeScript types from schemas
 *
 * These types are automatically generated from the Yup schemas
 * and ensure type safety when using these schemas in server actions
 */
export type PaymentFiltersInput = yup.InferType<typeof paymentFiltersSchema>;
