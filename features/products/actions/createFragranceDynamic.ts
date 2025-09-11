"use server"

import { prisma } from "@/utils/prisma"

export async function createFragranceDynamic(label: string) {
  const existing = await prisma.fragrance.findFirst({ where: { label } })
  if (existing) {
    return { error: false, message: "ok", payload: existing }
  }
  const created = await prisma.fragrance.create({ data: { label } })
  return { error: false, message: "ok", payload: created }
}


