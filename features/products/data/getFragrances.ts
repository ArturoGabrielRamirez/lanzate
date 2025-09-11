"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getFragrances() {
  return actionWrapper(async () => {
    const rows = await prisma.fragrance.findMany({ orderBy: { label: 'asc' } })
    return { payload: rows, error: false, message: 'ok' }
  })
}


