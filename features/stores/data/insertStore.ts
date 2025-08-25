"use server"

import { /* PrismaClient, */ Store } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"
import randomstring from "randomstring"
import { prisma } from "@/utils/prisma"

type InsertStoreReturn = {
    message: string
    payload: Store
    error: boolean
}

type StorePayload = {
    name: string
    description?: string
    subdomain: string
    is_physical_store?: boolean
    address?: string
    city?: string
    province?: string
    country?: string
    contact_phone?: string
    contact_email?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
}

export async function insertStore(payload: StorePayload, userId: number): Promise<InsertStoreReturn> {

    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const slug = randomstring.generate(8)

        const existingSlugStore = await prisma.store.findUnique({
            where: {
                slug: slug
            }
        })

        if (existingSlugStore) throw new Error("The store slug (Internal URL) already exists. Try another one.")

        const existingSubdomain = await prisma.store.findUnique({
            where: {
                subdomain: payload.subdomain
            }
        })

        if (existingSubdomain) throw new Error("The store subdomain (Public URL) already exists. Try another one.")

        // Obtener las categorías por defecto del sistema
        const defaultCategories = await prisma.defaultCategory.findMany({
            where: { is_active: true },
            orderBy: { sort_order: 'asc' }
        })

        const store = await prisma.store.create({
            data: {
                name: payload.name,
                slug: randomstring.generate(8),
                subdomain: payload.subdomain,
                description: payload.description,
                user_id: userId,
                is_physical_store: payload.is_physical_store || false,
                facebook_url: payload.facebook_url || null,
                instagram_url: payload.instagram_url || null,
                x_url: payload.x_url || null,
                email: payload.contact_email || null,
                phone: payload.contact_phone || null,
                branches: {
                    create: {
                        name: "Main Branch",
                        description: "Main starter branch",
                        address: payload.address || null,
                        city: payload.city || null,
                        province: payload.province || null,
                        country: payload.country || null,
                        email: payload.contact_email || null,
                        phone: payload.contact_phone || null,
                        is_main: true
                    }
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
            message: "Store created successfully",
            payload: store,
            error: false
        }

    })

}
