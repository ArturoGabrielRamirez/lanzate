"use server";

import { getCurrentUserWithIdAndEmailAction } from "@/features/auth/actions";
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils";

export async function getUserInfo() {

    return actionWrapper(async () => {

        const { payload: localUser, hasError: errorUser, message: messageUser } = await getCurrentUserWithIdAndEmailAction();

        if (errorUser || !localUser) throw new Error(messageUser)

        return formatSuccessResponse("Usuario encontrado correctamente", localUser)

    })
}
