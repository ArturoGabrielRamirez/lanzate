"use server";

import { getLocalUser } from "@/features/auth/actions";
import { LocalUserType } from "@/features/auth/types";
import { actionWrapper } from "@/features/global/utils";

export async function getUserInfo() {

    return actionWrapper<LocalUserType>(async () => {

        const { payload: localUser, hasError: errorUser, message: messageUser } = await getLocalUser();

        if (errorUser || !localUser) throw messageUser

        return {
            payload: localUser,
            hasError: false,
            message: "Usuario encontrado correctamente"
        }
    })
}