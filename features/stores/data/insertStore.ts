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

export async function insertStore(payload: any, userId: number): Promise<InsertStoreReturn> {

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
                branches: {
                    create: {
                        name: "Main Branch",
                        description: "Main starter branch"
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
                }
            }
        })

        return {
            message: "Store created successfully",
            payload: store,
            error: false
        }

    })

}
