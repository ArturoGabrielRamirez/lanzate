"use server"

import { getCurrentUserData } from "@/features/auth/data"
import { actionWrapper } from "@/features/global/utils"

export async function getCurrentUserAction() {

  return actionWrapper(async () => {

    const { user, error, message } = await getCurrentUserData()

    if (error) throw new Error(message)

    return {
      hasError: false,
      message: message,
      payload: user
    }
  })
}