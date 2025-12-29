"use server";

import { actionWrapper } from "@/features/global/utils";
import { selectStoreBasicInfoBySlugData } from "@/features/stores/data/select-store-basic-info-by-slug.data";

export async function getStoreBasicInfoBySlugAction(slug: string) {
  return actionWrapper(async () => {
    const { payload, hasError, message } =
      await selectStoreBasicInfoBySlugData(slug);

    if (hasError) throw new Error(message);

    if (!payload) {
      throw new Error("Tienda no encontrada");
    }

    return {
      hasError: false,
      message: message,
      payload: payload,
    };
  });
}
