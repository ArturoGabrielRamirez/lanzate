"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getColors({ storeId }: { storeId: number }) {
  return actionWrapper(async () => {
    const rows = await prisma.color.findMany({ where: { store_id: storeId }, orderBy: [{ name: 'asc' }, { id: 'asc' }] })
    return { payload: rows, error: false, message: 'ok' }
  })
}


