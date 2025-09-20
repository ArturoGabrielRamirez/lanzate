"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getFragrances({ store_id }: { store_id: number }) {
  return actionWrapper(async () => {

    const rows = await prisma.fragrance.findMany({
      where: { store_id },
      orderBy: { label: 'asc' },
      select: {
        id: true,
        label: true
      }
    })

    return { payload: rows, error: false, message: 'ok' }

  })
}


