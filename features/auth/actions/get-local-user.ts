"use server";
import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "./index";
import { actionWrapper } from "@/utils/lib";

export async function getLocalUser() {
  return actionWrapper(async () => {
    const { payload: user, error: userError, message: userMessage } = await getCurrentUser();
    
    if (userError || !user) {
      return {
        error: true,
        message: userMessage || "Usuario no autenticado",
        payload: null
      };
    }

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
      return {
        error: true,
        message: "Usuario no encontrado en la base de datos local",
        payload: null
      };
    }

    return {
      error: false,
      message: "Usuario local obtenido exitosamente",
      payload: localUser
    };
  });
}