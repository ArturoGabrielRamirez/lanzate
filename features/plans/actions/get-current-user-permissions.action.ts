"use server";

import { actionWrapper } from "@/features/global/utils";
import { getCurrentUserPermissionsData } from "@/features/plans/data/get-current-user-permissions.data";

export async function getCurrentUserPermissionsAction() {
    return actionWrapper(async () => {
        const user = await getCurrentUserPermissionsData();
        
        if (!user) {
            // Retornamos null explícitamente si no hay usuario logueado, 
            // esto no necesariamente es un error (usuario visitante)
            return {
                payload: null,
                hasError: false,
                message: "No hay sesión de usuario activa"
            };
        }

        return {
            payload: user,
            hasError: false,
            message: "Permisos de usuario obtenidos correctamente"
        };
    });
}

