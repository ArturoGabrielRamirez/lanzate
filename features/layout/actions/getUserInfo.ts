"use server";

import { getLocalUser } from "@/features/auth/actions/get-locale-user";
import { prisma } from "@/utils/prisma";

export async function getUserInfo() {
    const { localUser, error } = await getLocalUser();

    if (error || !localUser) {
        return {
            payload: null,
            error: true,
            message: error || "Usuario no encontrado"
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