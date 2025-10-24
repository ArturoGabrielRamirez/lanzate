"use server"

import { User } from "@supabase/supabase-js"

import { getCurrentUserData } from "@/features/auth/data"
import { actionWrapper } from "@/features/global/utils"

export async function getCurrentUserAction() {

  return actionWrapper<User>(async () => {

    const { user, error, message } = await getCurrentUserData();

    if (error) throw new Error(message)

    return {
      hasError: false,
      message: message,
      payload: user
    };
  });

}