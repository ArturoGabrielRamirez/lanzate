"use server";

import { PrismaClient } from "@/prisma/generated/prisma";
import { formatErrorResponse } from "@/utils/lib";
import { Category } from "../types";

export async function selectAllCategories(): Promise<{
  message: string;
  payload: Category[];
  error: boolean;
}> {
  try {
    const prisma = new PrismaClient();
    const categoriesRaw = await prisma.category.findMany();
    const categories: Category[] = categoriesRaw.map((cat) => ({
      ...cat,
      description: cat.description ?? undefined,
      image: cat.image ?? undefined,
    }));
    return {
      message: "Categories fetched successfully from db",
      payload: categories,
      error: false,
    };
  } catch (error) {
    return formatErrorResponse("Error fetching categories from db", error, []);
  }
} 