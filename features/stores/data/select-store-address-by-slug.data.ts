"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreAddressBySlugData(slug: string) {

    const store = await prisma.store.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            //is_physical_store: true,
            branches: {
                where: {
                    is_main: true
                },
                select: {
                    address: true,
                    city: true,
                    province: true,
                    country: true
                }
            }
        }
    })

    const mainBranch = store?.branches[0]
    
    const payload = {
        //is_physical_store: store?.is_physical_store ?? false,
        address: mainBranch?.address,
        city: mainBranch?.city,
        province: mainBranch?.province,
        country: mainBranch?.country
    }

    return {
        message: "Dirección de la tienda recuperada con éxito desde la base de datos",
        payload: payload,
        hasError: false
    }
}
