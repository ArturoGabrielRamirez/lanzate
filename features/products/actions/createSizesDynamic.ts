"use server"

import { prisma } from "@/utils/prisma"

export async function createSizesDynamic(label: string) {
  const existing = await prisma.sizes.findFirst({ where: { label } })
  if (existing) {
    return { error: false, message: "ok", payload: existing }
  }
  const created = await prisma.sizes.create({ data: { label } })
  return { error: false, message: "ok", payload: created }
}


