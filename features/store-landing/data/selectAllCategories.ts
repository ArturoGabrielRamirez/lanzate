"use server";

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper/* , formatErrorResponse */ } from "@/utils/lib";
import { Category } from "../types";
import { prisma } from "@/utils/prisma"

export async function selectAllCategories(): Promise<{
  message: string;
  payload: Category[];
  error: boolean;
}> {
  return actionWrapper(async () => {
    /* const prisma = new PrismaClient(); */

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
  })
} 