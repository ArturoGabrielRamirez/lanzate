import { UpdateAddressPayload } from "@/features/stores/types"
import { prisma } from "@/utils/prisma"

export async function updateStoreAddressData(slug: string, payload: UpdateAddressPayload) {
    const existingStore = await prisma.store.findUnique({
        where: {
            slug
        },
        include: {
            branches: {
                where: {
                    is_main: true
                }
            }
        }
    })

    if (!existingStore) {
        throw new Error("Tienda no encontrada")
    }

    const mainBranch = existingStore.branches.find((branch) => branch.is_main)

    if (!mainBranch) {
        throw new Error("Sucursal principal no encontrada")
    }

    // According to instructions:
    // If is_physical_store is false (Online), clear address fields.
    // If is_physical_store is true (Physical), use payload values.
    const isPhysical = payload.is_physical_store

    const addressData = isPhysical ? {
        address: payload.address || null,
        city: payload.city || null,
        province: payload.province || null,
        country: payload.country || null,
    } : {
        address: null,
        city: null,
        province: null,
        country: null,
    }

    // Update Branch Address
    const updatedBranch = await prisma.branch.update({
        where: {
            id: mainBranch.id
        },
        data: addressData
    })

    //TODO :  Update Branch  is_physical_store 
    /* await prisma.store.update({
        where: {
            id: existingStore.id
        },
        data: {
            is_physical_store: isPhysical
        }
    }) */

    return updatedBranch
}

