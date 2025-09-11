"use server"

import { prisma } from "@/utils/prisma"

export async function createFlavorDynamic(label: string) {
  const existing = await prisma.flavor.findFirst({ where: { label } })
  if (existing) {
    return { error: false, message: "ok", payload: existing }
  }
  const created = await prisma.flavor.create({ data: { label } })
  return { error: false, message: "ok", payload: created }
}


