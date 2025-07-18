"use server"

import { formatErrorResponse } from "@/utils/lib";
import { selectAllCategories } from "../data/selectAllCategories";
import { Category } from "../types";

export async function getCategories(): Promise<{
  message: string;
  payload: Category[];
  error: boolean;
}> {
  try {
    const { payload: categories, error, message } = await selectAllCategories();
    if (error) throw new Error(message);
    return {
      message: "Categories fetched successfully",
      payload: categories,
      error: false,
    };
  } catch (error) {
    return formatErrorResponse("Error fetching categories", error, []);
  }
}
