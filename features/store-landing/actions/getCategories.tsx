"use server"

import { actionWrapper } from "@/utils/lib";
import { selectAllCategories } from "../data/selectAllCategories";
import { Category } from "@prisma/client";

export async function getCategories(storeId?: number): Promise<{
  message: string;
  payload: Category[];
  error: boolean;
}> {
  return actionWrapper(async () => {
    const { payload: categories, error, message } = await selectAllCategories(storeId);
    if (error) throw new Error(message);
    return {
      message: "Categories fetched successfully",
      payload: categories,
      error: false,
    };
  });
}
