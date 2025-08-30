import * as yup from "yup"
import { PaymentMethod } from "@prisma/client"

export const operationalSettingsSchema = yup.object({
  offers_delivery: yup.boolean().required(),

  delivery_price: yup
    .string()
    .when("offers_delivery", {
      is: true,
      then: (schema) =>
        schema
          .required("Delivery price is required")
          .test("is-number", "Must be a number", (value) => !isNaN(Number(value)))
          .test("min", "Min 0", (value) => Number(value) >= 0),
      otherwise: (schema) => schema.notRequired(),
    }),

  free_delivery_minimum: yup.string().when("offers_delivery", {
  is: true,
  then: (schema) =>
    schema
      .test("is-number", "Must be a number", (value) => !value || !isNaN(Number(value)))
      .test("min", "Min 0", (value) => !value || Number(value) >= 0),
  otherwise: (schema) => schema.notRequired(),
}),

  delivery_radius_km: yup
    .string()
    .when("offers_delivery", {
      is: true,
      then: (schema) =>
        schema
          .required("Delivery radius is required")
          .test("is-number", "Must be a number", (value) => !isNaN(Number(value)))
          .test("min", "Min 1", (value) => Number(value) >= 1)
          .test("max", "Max 100", (value) => Number(value) <= 100),
      otherwise: (schema) => schema.notRequired(),
    }),

  minimum_order_amount: yup
    .string()
    .required()
    .test("is-number", "Must be a number", (value) => !isNaN(Number(value)))
    .test("min", "Min 0", (value) => Number(value) >= 0),

  payment_methods: yup
    .array()
    .of(
      yup
        .mixed<PaymentMethod>()
        .oneOf(Object.values(PaymentMethod))
        .required()
    )
    .min(1, "Select at least one")
    .required(),
})
