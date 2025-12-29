"use server";

import { prisma } from "@/utils/prisma";

export async function selectStoreBasicInfoBySlugData(slug: string) {
  const store = await prisma.store.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      branches: {
        include: {
          stock_items: true,
        },
      },
    },
  });

  if (!store) {
    return {
      message: "Tienda no encontrada",
      payload: null,
      hasError: true,
    };
  }

  return {
    message: "Información básica de tienda recuperada con éxito",
    payload: store,
    hasError: false,
  };
}
