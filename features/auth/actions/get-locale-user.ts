"use server";

import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "./get-user";

export async function getLocalUser() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { localUser: null, error: userError || "User not found" };
  }

  try {
    // Primero buscar por supabase_user_id (más confiable)
    let localUser = await prisma.user.findUnique({
      where: {
        supabase_user_id: user.id
      },
      include: {
        Account: true // Incluir información de cuenta si es necesaria
      }
    });

    // Si no existe, buscar por email y vincular
    if (!localUser) {
      localUser = await prisma.user.findUnique({
        where: {
          email: user.email!
        },
        include: {
          Account: true
        }
      });

      // Si encontramos por email, actualizar con supabase_user_id
      if (localUser) {
        localUser = await prisma.user.update({
          where: { id: localUser.id },
          data: {
            supabase_user_id: user.id,
            email: user.email!, // Asegurar que el email esté actualizado
            updated_at: new Date()
          },
          include: {
            Account: true
          }
        });
      }
    } else {
      // Si encontramos por supabase_user_id, verificar si el email necesita actualización
      if (localUser.email !== user.email) {
        localUser = await prisma.user.update({
          where: { id: localUser.id },
          data: {
            email: user.email!,
            updated_at: new Date()
          },
          include: {
            Account: true
          }
        });
      }
    }

    if (!localUser) {
      return { localUser: null, error: "Usuario no encontrado en la base de datos local" };
    }

    return { localUser, error: null };

  } catch (error) {
    console.error('Error getting local user:', error);
    return { localUser: null, error: "Error al obtener usuario local" };
  }
}