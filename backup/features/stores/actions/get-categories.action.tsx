"use server"

import { actionWrapper } from "@/features/global/utils";
import { selectAllCategoriesData } from "@/features/stores/data/select-all-categories.data";

export async function getCategoriesAction(storeId?: number) {
  return actionWrapper(async () => {

    const { payload: categories, hasError, message } = await selectAllCategoriesData(storeId);

    if (hasError) throw new Error(message);

    return {
      message: "Categorías obtenidas exitosamente",
      payload: categories,
      hasError: false,
    };
  });
}
