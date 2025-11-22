"use server"

import { PaymentMethod, Prisma } from '@prisma/client'
import randomstring from "randomstring"

import { ProcessedCreateStoreData } from '@/features/stores/types'
import { prisma } from "@/utils/prisma"

export async function insertStoreData(payload: ProcessedCreateStoreData, userId: number) {

    const slug = randomstring.generate(8)

    const existingSlugStore = await prisma.store.findUnique({
        where: {
            slug: slug
        }
    })

    if (existingSlugStore) throw new Error("El identificador legible de la tienda (URL interna) ya existe. Intentá con otro  .")

    const existingSubdomain = await prisma.store.findUnique({
        where: {
            subdomain: payload.basic_info.subdomain
        }
    })

    if (existingSubdomain) throw new Error("El subdominio de la tienda (URL pública) ya existe. Intentá con otro.")

    // Obtener las categorías por defecto del sistema
    const defaultCategories = await prisma.defaultCategory.findMany({
        where: { is_active: true },
        orderBy: { sort_order: 'asc' }
    })

    // All data should come pre-processed from the frontend helpers
    const openingHoursData = payload.processedOpeningHours
    const shippingMethodsData = payload.processedShippingMethods
    const paymentMethods = payload.processedPaymentMethods as PaymentMethod[]

    // Build branch nested data to satisfy Prisma types
    type ExtendedBranchCreate = Prisma.BranchCreateWithoutStoreInput & {
        opening_hours?: Prisma.BranchOpeningHourCreateNestedManyWithoutBranchInput
        shipping_methods?: Prisma.BranchShippingMethodCreateNestedManyWithoutBranchInput
    }

    const branchData: ExtendedBranchCreate = {
        name: "Sucursal principal",
        description: "Sucursal inicial de la tienda",
        address: payload.address_info.address || null,
        city: payload.address_info.city || null,
        province: payload.address_info.province || null,
        country: payload.address_info.country || null,
        email: payload.contact_info.contact_email || null,
        phone: payload.contact_info.contact_phone || null,
        facebook_url: payload.contact_info.facebook_url || null,
        instagram_url: payload.contact_info.instagram_url || null,
        x_url: payload.contact_info.x_url || null,
        is_main: true,
        operational_settings: {
            create: {
                is_open_24_hours: payload.settings?.is_open_24_hours ?? true,
                offers_delivery: payload.shipping_info?.offers_delivery ?? false,
                payment_methods: paymentMethods,
            }
        },
    }

    if (openingHoursData.length > 0) {
        branchData.opening_hours = { create: openingHoursData }
    }

    if (shippingMethodsData.length > 0) {
        branchData.shipping_methods = { create: shippingMethodsData }
    }

    const store = await prisma.store.create({
        data: {
            name: payload.basic_info.name,
            slug: slug,
            subdomain: payload.basic_info.subdomain,
            description: payload.basic_info.description,
            user_id: userId,
            logo: payload.basic_info.logo as string || null,
            is_physical_store: payload.address_info.is_physical_store || false,
            branches: {
                create: branchData,
            },
            balance: {
                create: {
                    current_balance: 0,
                }
            },
            // Crear categorías por defecto para la tienda
            categories: {
                create: defaultCategories.map(cat => ({
                    name: cat.name,
                    description: cat.description,
                    image: cat.image,
                    slug: cat.slug,
                    is_default: true,
                    sort_order: cat.sort_order,
                    is_active: cat.is_active
                }))
            },
            customization: {
                create: {

                }
            },
        }
    })

    return {
        message: "Tienda creada con éxito",
        payload: store,
        hasError: false
    }

}
