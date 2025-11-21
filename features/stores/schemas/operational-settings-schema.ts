import { PaymentMethod } from "@prisma/client"
import * as yup from "yup"

export const editOperationalSettingsSchema = yup.object({
    offers_delivery: yup.boolean().required(),
    delivery_price: yup.string().when("offers_delivery", {
        is: true,
        then: (schema) => schema
            .required("El precio de entrega es obligatorio")
            .matches(/^\d+(?:\.\d+)?$/, "Debe ser un número válido"),
        otherwise: (schema) => schema.optional(),
    }),
    free_delivery_minimum: yup.string().when("offers_delivery", {
        is: true,
        then: (schema) => schema
            .optional()
            .matches(/^$|^\d+(?:\.\d+)?$/, "Debe ser un número válido"),
        otherwise: (schema) => schema.optional(),
    }),
    delivery_radius_km: yup.string().when("offers_delivery", {
        is: true,
        then: (schema) => schema
            .required("El radio de entrega es obligatorio")
            .matches(/^\d+$/, "Debe ser un número entero"),
        otherwise: (schema) => schema.optional(),
    }),
    minimum_order_amount: yup
        .string()
        .required("El monto mínimo de pedido es obligatorio")
        .matches(/^\d+(?:\.\d+)?$/, "Debe ser un número válido"),
})


export const operationalSettingsSchema = yup.object({
  offers_delivery: yup.boolean().required(),

  delivery_price: yup
    .string()
    .when("offers_delivery", {
      is: true,
      then: (schema) =>
        schema
          .required("El precio de entrega es obligatorio")
          .test("is-number", "Debe ser un número", (value) => !isNaN(Number(value)))
          .test("min", "Mínimo 0", (value) => Number(value) >= 0),
      otherwise: (schema) => schema.notRequired(),
    }),

  free_delivery_minimum: yup.string().when("offers_delivery", {
  is: true,
  then: (schema) =>
    schema
      .test("is-number", "Debe ser un número", (value) => !value || !isNaN(Number(value)))
      .test("min", "Mínimo 0", (value) => !value || Number(value) >= 0),
  otherwise: (schema) => schema.notRequired(),
}),

  delivery_radius_km: yup
    .string()
    .when("offers_delivery", {
      is: true,
      then: (schema) =>
        schema
          .required("El radio de entrega es obligatorio")
          .test("is-number", "Debe ser un número", (value) => !isNaN(Number(value)))
          .test("min", "Mínimo 1", (value) => Number(value) >= 1)
          .test("max", "Máximo 100", (value) => Number(value) <= 100),
      otherwise: (schema) => schema.notRequired(),
    }),

  minimum_order_amount: yup
    .string()
    .required()
    .test("is-number", "Debe ser un número", (value) => !isNaN(Number(value)))
    .test("min", "Mínimo 0", (value) => Number(value) >= 0),

  payment_methods: yup
    .array()
    .of(
      yup
        .mixed<PaymentMethod>()
        .oneOf(Object.values(PaymentMethod))
        .required()
    )
    .min(1, "Seleccioná al menos un método de pago")
    .required(),
})
