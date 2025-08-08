"use server";

import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "./get-user";

export async function getLocalUser() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { localUser: null, error: userError || "User not found" };
  }

  try {
    let localUser = await prisma.user.findUnique({
      where: {
        supabase_user_id: user.id
      },
      include: {
        Account: true
      }
    });

    if (!localUser) {
      localUser = await prisma.user.findUnique({
        where: {
          email: user.email!
        },
        include: {
          Account: true
        }
      });

      if (localUser) {
        localUser = await prisma.user.update({
          where: { id: localUser.id },
          data: {
            supabase_user_id: user.id,
            email: user.email!,
            updated_at: new Date()
          },
          include: {
            Account: true
          }
        });
      }
    } else {
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