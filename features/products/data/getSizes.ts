"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getSizes({ store_id }: { store_id: number }) {
  return actionWrapper(async () => {
    const rows = await prisma.sizes.findMany({ where: { store_id }, orderBy: { label: 'asc' } })
    return { payload: rows, error: false, message: 'ok' }
  })
}


