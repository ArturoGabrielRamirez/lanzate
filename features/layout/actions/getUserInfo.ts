"use server";

import { getCurrentUserWithIdAndEmailAction } from "@/features/auth/actions";
import { actionWrapper } from "@/features/global/utils";

export async function getUserInfo() {

    return actionWrapper(async () => {

        const { payload: localUser, error: errorUser, message: messageUser } = await getCurrentUserWithIdAndEmailAction();

        if (errorUser || !localUser) throw new Error(messageUser)

        return {
            payload: localUser,
            hasError: false,
            message: "Usuario encontrado correctamente"
        };

    })
}
