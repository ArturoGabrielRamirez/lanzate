"use server"

import { InsertBranchProps } from "@/features/branches/types"
import { prisma } from "@/utils/prisma"


export async function insertBranchData({ name, address, email, phone, storeId }: InsertBranchProps) {

    const existingBranches = await prisma.branch.count({
        where: {
            store_id: storeId
        }
    })

    const isFirstBranch = existingBranches === 0

    const branch = await prisma.branch.create({
        data: {
            store_id: storeId,
            name: name,
            address: address,
            email: email,
            phone: phone,
            is_main: isFirstBranch
        }
    })

    return {
        hasError: false,
        message: "Sucursal creada con éxito",
        payload: branch
    }
}
