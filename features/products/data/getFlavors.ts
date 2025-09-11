"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getFlavors() {
  return actionWrapper(async () => {
    const rows = await prisma.flavor.findMany({ orderBy: { label: 'asc' } })
    return { payload: rows, error: false, message: 'ok' }
  })
}


