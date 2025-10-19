"use server";


import { getCurrentUser } from "@/features/auth/actions";
import { prisma } from "@/utils/prisma";

export async function getUserInfo() {
    const { payload: localUser, error: errorUser, message: messageUser } = await getCurrentUser();

    if (errorUser || !localUser) {
        return {
            payload: null,
            error: true,
            message: messageUser || "Usuario no encontrado"
        };
    }

    try {
        // Obtener el usuario con sus relaciones
        const userWithRelations = await prisma.user.findUnique({
            where: { id: localUser.id },
            include: {
                Account: true,
                Store: true,
                // Agregar otras relaciones que necesites
            }
        });

        if (!userWithRelations) {
            return {
                payload: null,
                error: true,
                message: "Usuario no encontrado en base de datos"
            };
        }

        return {
            payload: userWithRelations,
            error: false,
            message: "Usuario encontrado correctamente"
        };

    } catch (error) {
        console.error('Error in getUserInfo:', error);
        return {
            payload: null,
            error: true,
            message: "Error al obtener información del usuario"
        };
    }
}

// Función alternativa con cache manual usando un enfoque diferente
export async function getUserInfoCached() {
    // En lugar de unstable_cache, puedes usar cache a nivel de componente
    // o implementar tu propio sistema de cache
    return await getUserInfo();
}