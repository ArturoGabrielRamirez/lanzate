"use server";

import { getCurrentUserAction } from "@/features/auth/actions";
import { getUserByEmail, getUserBySupabaseId, updateUserEmail, updateUserSupabaseIdAndEmail } from "@/features/auth/data";
import { LocalUserType } from "@/features/auth/types";
import { actionWrapper } from "@/features/global/utils";

export async function getLocalUser() {
  return actionWrapper<LocalUserType>(async () => {

    const { payload: user } = await getCurrentUserAction();

    if (!user) throw new Error("User not found")
    if (!user.email) throw new Error("User email not found")

    const { payload: supabaseUser } = await getUserBySupabaseId(user.id);
    let localUser = supabaseUser;

    if (!localUser) {

      const { payload: emailUser } = await getUserByEmail(user.email);
      localUser = emailUser;

      if (localUser) {
        const { payload: updatedUser } = await updateUserSupabaseIdAndEmail(localUser.id, user.id, user.email!);
        localUser = updatedUser;
      }

    } else {

      if (localUser.email !== user.email) {
        const { payload: updatedUser } = await updateUserEmail(localUser.id, user.email!);
        localUser = updatedUser;
      }

    }

    return {
      hasError: false,
      message: "Usuario local obtenido exitosamente",
      payload: localUser
    };
  });
}