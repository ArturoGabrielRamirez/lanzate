"use server";

import { prisma } from "@/utils/prisma"

export async function selectAllCategoriesData(storeId?: number) {
  const categoriesRaw = await prisma.category.findMany({
    where: {
      store_id: storeId
    }
  });

  const categories = categoriesRaw.map((cat) => ({
    ...cat,
    description: cat.description ?? undefined,
    image: cat.image ?? undefined,
  }));

  return {
    message: "Categorías recuperadas con éxito",
    payload: categories,
    hasError: false,
  };
} 