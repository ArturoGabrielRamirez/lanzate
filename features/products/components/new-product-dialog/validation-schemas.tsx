import { z } from "zod"

export const emptySchema = z.object({})

export const basicInfoSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    url: z.string().regex(/^[a-zA-Z0-9-_.]+$/, { message: "URL must contain only letters and numbers" }),
    description: z.string().max(255, { message: "Description must be less than 255 characters long" }),
    categories: z.array(z.object({ label: z.string(), value: z.string() })),
})

export const pricingAndStockSchema = z.object({
    price: z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Price must be a positive number greater than zero" }),
    stock: z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Stock must be a positive number greater than zero" }),
    sku: z.string().optional().nullable(),
    barcode: z.string().optional().nullable(),
    is_published: z.boolean().optional().nullable(),
    is_active: z.boolean().optional().nullable(),
    is_featured: z.boolean().optional().nullable(),
})

export const mediaSchema = z.object({
    images: z.array(z.file()).optional().nullable(),
    primary_image: z.file().optional().nullable(),
})

export const attributesSchema = z.object({
    selected_attributes: z.array(z.string()).optional().nullable(),
    weight: z.string().optional().nullable(),
    weight_unit: z.string().optional().nullable(),
    expiration_date: z.string().optional().nullable(),
    height: z.string().optional().nullable(),
    height_unit: z.string().optional().nullable(),
    width: z.string().optional().nullable(),
    width_unit: z.string().optional().nullable(),
    depth: z.string().optional().nullable(),
    depth_unit: z.string().optional().nullable(),
    circumference: z.string().optional().nullable(),
    circumference_unit: z.string().optional().nullable(),
    sizes: z.array(z.object({ id: z.number(), label: z.string() })).optional().nullable(),
    dimensions: z.array(z.object({ id: z.number(), label: z.string() })).optional().nullable(),
    flavors: z.array(z.object({ id: z.number(), label: z.string() })).optional().nullable(),
    fragrances: z.array(z.object({ id: z.number(), label: z.string() })).optional().nullable(),
    colors: z.array(z.object({ value: z.string(), name: z.string().optional() })).optional().nullable(),
    materials: z.array(z.object({ value: z.file(), name: z.string().min(1, { message: "Name is required" }) })).optional().nullable(),
})

export const formSchema = z.object({
    ...basicInfoSchema.shape,
    ...pricingAndStockSchema.shape,
    ...mediaSchema.shape,
    ...attributesSchema.shape,
}).superRefine((ref, ctx) => {

    if (ref.selected_attributes?.includes("Peso")) {
        if (!ref.weight) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Weight is required",
            })
        }

        const weight_schema = z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Weight must be a positive number greater than zero" })
        if (!weight_schema.safeParse(ref.weight).success) {
            ctx.addIssue({
                code: "custom",
                message: "Weight must be a positive number greater than zero",
                path: ["weight"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Fecha de vencimiento")) {
        if (!ref.expiration_date) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Expiration date is required",
            })
        }

        const expiration_date_schema = z.date()
        const formated_date = new Date(ref.expiration_date as string)
        const today = new Date()
        if (formated_date < today) {
            ctx.addIssue({
                code: "custom",
                message: "Expiration date must be greater than today",
                path: ["expiration_date"],
            })
        }
        if (!expiration_date_schema.safeParse(formated_date).success) {
            ctx.addIssue({
                code: "custom",
                message: "Expiration date must be a valid date",
                path: ["expiration_date"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Alto")) {
        if (!ref.height) {
            ctx.addIssue({
                code: "custom",
                message: "Height is required",
                path: ["height"],
            })
        }

        const height_schema = z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Height must be a positive number greater than zero" })
        if (!height_schema.safeParse(ref.height).success) {
            ctx.addIssue({
                code: "custom",
                message: "Height must be a positive number greater than zero",
                path: ["height"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Ancho")) {
        if (!ref.width) {
            ctx.addIssue({
                code: "custom",
                message: "Width is required",
                path: ["width"],
            })
        }

        const width_schema = z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Width must be a positive number greater than zero" })
        if (!width_schema.safeParse(ref.width).success) {
            ctx.addIssue({
                code: "custom",
                message: "Width must be a positive number greater than zero",
                path: ["width"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Profundidad")) {
        if (!ref.depth) {
            ctx.addIssue({
                code: "custom",
                message: "Depth is required",
                path: ["depth"],
            })
        }

        const depth_schema = z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Depth must be a positive number greater than zero" })
        if (!depth_schema.safeParse(ref.depth).success) {
            ctx.addIssue({
                code: "custom",
                message: "Depth must be a positive number greater than zero",
                path: ["depth"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Circumferencia")) {
        if (!ref.circumference) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Circumference is required",
            })
        }

        const circumference_schema = z.string().regex(/^[1-9]\d*(\.\d+)?$/, { message: "Circumference must be a positive number greater than zero" })
        if (!circumference_schema.safeParse(ref.circumference).success) {
            ctx.addIssue({
                code: "custom",
                message: "Circumference must be a positive number greater than zero",
                path: ["circumference"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Talle")) {
        if (!ref.sizes) {
            return ctx.addIssue({
                code: "custom",
                message: "Sizes is required",
                path: ["sizes"],
            })
        }

        if (!ref.sizes.length) {
            ctx.addIssue({
                code: "custom",
                message: "Sizes is required",
                path: ["sizes"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Tamaño")) {
        if (!ref.dimensions) {
            return ctx.addIssue({
                code: "custom",
                message: "Dimensions is required",
                path: ["dimensions"],
            })
        }

        if (!ref.dimensions.length) {
            ctx.addIssue({
                code: "custom",
                message: "Dimensions is required",
                path: ["dimensions"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Sabor")) {
        if (!ref.flavors) {
            return ctx.addIssue({
                code: "custom",
                message: "Flavors is required",
                path: ["flavors"],
            })
        }

        if (!ref.flavors.length) {
            ctx.addIssue({
                code: "custom",
                message: "Flavors is required",
                path: ["flavors"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Fragancia")) {
        if (!ref.fragrances) {
            return ctx.addIssue({
                code: "custom",
                message: "Fragrances is required",
                path: ["fragrances"],
            })
        }

        if (!ref.fragrances.length) {
            ctx.addIssue({
                code: "custom",
                message: "Fragrances is required",
                path: ["fragrances"],
            })
        }
    }

    if (ref.selected_attributes?.includes("Color")) {
        if (!ref.colors) {
            return ctx.addIssue({
                code: "custom",
                message: "Colors is required",
                path: ["colors"],
            })
        }

        if (!ref.colors.length) {
            ctx.addIssue({
                code: "custom",
                message: "Colors is required",
                path: ["colors"],
            })
        }
    }

    
    if (ref.selected_attributes?.includes("Material")) {
        if (!ref.materials) {
            return ctx.addIssue({
                code: "custom",
                message: "Materials is required",
                path: ["materials"],
            })
        }

        if (!ref.materials.length) {
            ctx.addIssue({
                code: "custom",
                message: "Materials is required",
                path: ["materials"],
            })
        }
    }
})

export type FormValues = z.infer<typeof formSchema>