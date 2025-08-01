"use server"

import { PrismaClient } from '@prisma/client'
import { formatErrorResponse } from "@/utils/lib"

export async function updateStoreBySlug(slug: string, data: any) {
    try {

        const client = new PrismaClient()

        // Separar los campos de operational_settings de los campos del store
        const { contact_phone, contact_whatsapp, facebook_url, instagram_url, x_url, ...storeData } = data

        const operationalData = {
            contact_phone,
            contact_whatsapp,
            facebook_url,
            instagram_url,
            x_url,
        }

        // Filtrar campos undefined/null para no enviarlos a la base de datos
        const cleanOperationalData = Object.fromEntries(
            Object.entries(operationalData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        )

        const updatedStore = await client.store.update({
            where: {
                slug: slug
            },
            data: { 
                ...storeData,
                operational_settings: Object.keys(cleanOperationalData).length > 0 ? {
                    upsert: {
                        update: cleanOperationalData,
                        create: cleanOperationalData
                    }
                } : undefined
            },
            include: {
                operational_settings: true
            }
        })

        return {
            message: "Store updated successfully",
            payload: updatedStore,
            error: false
        }
        
    } catch (error) {
        return formatErrorResponse("Error updating store", error, null)
    }
}
