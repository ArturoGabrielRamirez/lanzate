"use server"

import { actionWrapper } from "@/utils/lib";
import { selectCategoriesBySubdomain } from "../data/selectCategoriesBySubdomain";

export async function getCategoriesBySubdomain(subdomain: string) {
  return actionWrapper(async () => {
    const { payload: categories, error, message } = await selectCategoriesBySubdomain(subdomain);
    if (error) throw new Error(message);
    return {
      message: "Categories fetched successfully",
      payload: categories,
      error: false,
    };
  });
} 