"use server";

/* import { createServerSideClient } from "@/utils/supabase/server"; */
import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "./get-user";

export async function getLocalUser() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { localUser: null, error: userError || "User not found" };
  }

  try {
    // Primero buscar por supabase_user_id (método preferido)
    let localUser = await prisma.user.findUnique({
      where: {
       supabase_user_id: user.id
      }
    });

    // Si no se encuentra por supabase_user_id, buscar por email y actualizar
    if (!localUser) {
      localUser = await prisma.user.findUnique({
        where: {
          email: user.email!
        }
      });

      // Si se encuentra por email, actualizar con supabase_user_id
      if (localUser) {
        localUser = await prisma.user.update({
          where: { id: localUser.id },
          data: {
            supabase_user_id: user.id,
            email: user.email!, // Asegurar que el email esté sincronizado
            updated_at: new Date()
          }
        });
        console.log(`✅ Usuario migrado: ${localUser.id} -> supabase_user_id: ${user.id}`);
      }
    } else {
      // Si se encuentra por supabase_user_id, verificar que el email esté sincronizado
      if (localUser.email !== user.email) {
        localUser = await prisma.user.update({
          where: { id: localUser.id },
          data: {
            email: user.email!,
            updated_at: new Date()
          }
        });
        console.log(`✅ Email sincronizado para usuario ${localUser.id}: ${user.email}`);
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