"use server";

import {
  createChangePasswordData /* , getUserData */,
} from "@/features/auth/data";
import { actionWrapper } from "@/features/global/utils";

export async function handleEditPasswordAction(
  currentPassword: string,
  email: string,
) {
  return actionWrapper(async () => {
    /*    const { payload: user, hasError: userError, message } = await getUserData(); */

    /*  if (userError || !user) {
      return {
        hasError: true,
        message: message || "Error al obtener el usuario",
        payload: null
      }
    } */

    const payload = await createChangePasswordData({ email, currentPassword });

    return payload;
  });
}
