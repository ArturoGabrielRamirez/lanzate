"use server"

import { DataType } from '@/features/stores/types'
import { prisma } from "@/utils/prisma"


export async function updateStoreBySlugData(slug: string, data: DataType) {

    // Separar los campos de operational_settings de los campos del store
    const { contact_phone, contact_whatsapp, facebook_url, instagram_url, x_url, address, city, province, country, ...storeData } = data

    // Usar todos los campos de operational_settings que ahora existen en la base de datos
    const operationalData = {
        contact_phone,
        contact_whatsapp,
        facebook_url,
        instagram_url,
        x_url,
    }

    // Filtrar solo campos undefined/null, pero permitir strings vacíos
    const cleanOperationalData = Object.fromEntries(
        Object.entries(operationalData).filter(([_, value]) => value !== undefined && value !== null)
    )

    // Primero obtener el store para tener el ID
    const existingStore = await prisma.store.findUnique({
        where: { slug },
        select: { id: true, operational_settings: true, branches: true }
    })

    if (!existingStore) {
        throw new Error("Store not found")
    }

    const mainBranch = existingStore.branches?.find((branch) => branch.is_main)

    // Actualizar el store principal
    await prisma.store.update({
        where: {
            slug: slug
        },
        data: {
            ...storeData,
            /* phone: storeData.contact_phone,
            email: storeData.contact_email, */
            /* facebook_url: facebook_url, */
            /* instagram_url: instagram_url, */
            /* x_url: x_url, */
            /* is_physical_store: storeData.is_physical_store, */
            branches: {
                update: {
                    where: {
                        id: mainBranch?.id
                    },
                    data: {
                        address: address,
                        city: city,
                        province: province,
                        country: country,
                    }
                }
            }
        }
    })

    // Actualizar operational_settings - siempre procesar si hay campos en operationalData
    if (Object.keys(operationalData).length > 0) {
        if (existingStore.operational_settings) {
            // Actualizar si ya existe
            await prisma.storeOperationalSettings.update({
                where: { store_id: existingStore.id },
                data: cleanOperationalData
            })
        } else {
            // Crear si no existe
            await prisma.storeOperationalSettings.create({
                data: {
                    ...cleanOperationalData,
                    store_id: existingStore.id
                }
            })
        }
    }

    // Obtener el store actualizado con operational_settings
    const finalStore = await prisma.store.findUnique({
        where: { slug },
        include: {
            operational_settings: true
        }
    })

    return {
        message: "Store updated successfully",
        payload: finalStore,
        hasError: false
    }

}
