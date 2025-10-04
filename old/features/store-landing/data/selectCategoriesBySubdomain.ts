"use server";

import { actionWrapper } from "@/utils/lib";
import { Category } from "../types";
import { prisma } from "@/utils/prisma"

export async function selectCategoriesBySubdomain(subdomain: string): Promise<{
  message: string;
  payload: Category[];
  error: boolean;
}> {
  return actionWrapper(async () => {
    const store = await prisma.store.findUnique({
      where: { subdomain },
      select: { id: true }
    });

    if (!store) {
      throw new Error("Store not found");
    }

    const categoriesRaw = await prisma.category.findMany({
      where: {
        store_id: store.id,
        is_active: true
      },
      orderBy: {
        sort_order: 'asc'
      }
    });

    const categories: Category[] = categoriesRaw.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description ?? undefined,
      image: cat.image ?? undefined,
      slug: cat.slug,
    }));

    return {
      message: "Categories fetched successfully from db",
      payload: categories,
      error: false,
    };
  })
} 