"use server"

import { /* PrismaClient, */ Store } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"
import randomstring from "randomstring"
import { prisma } from "@/utils/prisma"
import { CreateStoreFormValues } from '../components/create-store-button-new'

type InsertStoreReturn = {
    message: string
    payload: Store
    error: boolean
}

export async function insertStore(payload: CreateStoreFormValues, userId: number): Promise<InsertStoreReturn> {

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
                subdomain: payload.basic_info.subdomain
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
                name: payload.basic_info.name,
                slug: randomstring.generate(8),
                subdomain: payload.basic_info.subdomain,
                description: payload.basic_info.description,
                user_id: userId,
                logo: payload.basic_info.logo as string || null,
                is_physical_store: payload.address_info.is_physical_store || false,
                facebook_url: payload.contact_info.facebook_url || null,
                instagram_url: payload.contact_info.instagram_url || null,
                x_url: payload.contact_info.x_url || null,
                email: payload.contact_info.contact_email || null,
                phone: payload.contact_info.contact_phone || null,
                branches: {
                    create: {
                        name: "Main Branch",
                        description: "Main starter branch",
                        address: payload.address_info.address || null,
                        city: payload.address_info.city || null,
                        province: payload.address_info.province || null,
                        country: payload.address_info.country || null,
                        email: payload.contact_info.contact_email || null,
                        phone: payload.contact_info.contact_phone || null,
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
