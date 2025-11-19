"use server";

import { actionWrapper } from "@/features/global/utils";
import { getCurrentUserPermissionsData } from "../data/get-current-user-permissions.data";

export async function getCurrentUserPermissionsAction() {
    return actionWrapper(async () => {
        const user = await getCurrentUserPermissionsData();
        
        if (!user) {
            // Retornamos null explícitamente si no hay usuario logueado, 
            // esto no necesariamente es un error (usuario visitante)
            return {
                payload: null,
                hasError: false,
                message: "No user session"
            };
        }

        return {
            payload: user,
            hasError: false,
            message: "User permissions fetched successfully"
        };
    });
}

