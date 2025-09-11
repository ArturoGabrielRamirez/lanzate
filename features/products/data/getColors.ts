"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getColors() {
  return actionWrapper(async () => {
    const rows = await prisma.color.findMany({ orderBy: [{ name: 'asc' }, { id: 'asc' }] })
    return { payload: rows, error: false, message: 'ok' }
  })
}


