"use server";

import { createServerSideClient } from "@/utils/supabase/server";
import { getCurrentUser } from "./get-user";
import { prisma } from "@/utils/prisma";
import { randomUUID } from "crypto";

export async function handleEditEmail(email: string) {
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { error: userError || "User not found" };
    }

    // Obtener el usuario desde tu base de datos local (asumiendo que tienes una relación)
    const localUser = await prisma.user.findFirst({
        where: { 
            // Asume que tienes algún campo para relacionar con Supabase
            // Ajusta según tu esquema
            email: user.email 
        }
    });

    if (!localUser) {
        return { error: "Usuario no encontrado en la base de datos local" };
    }

    try {
        // 1. Crear o actualizar el registro de cambio de email
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Expira en 24 horas

        // Verificar si ya existe una solicitud pendiente
        const existingRequest = await prisma.email_change_requests.findFirst({
            where: {
                user_id: localUser.id,
                completed: false,
                expires_at: {
                    gt: new Date()
                }
            }
        });

        let changeRequest;

        if (existingRequest) {
            // Actualizar la solicitud existente
            changeRequest = await prisma.email_change_requests.update({
                where: { id: existingRequest.id },
                data: {
                    new_email: email,
                    old_email_confirmed: false,
                    new_email_confirmed: false,
                    old_email_confirmed_at: null,
                    new_email_confirmed_at: null,
                    expires_at: expiresAt,
                    updated_at: new Date()
                }
            });
        } else {
            // Crear nueva solicitud
            changeRequest = await prisma.email_change_requests.create({
                data: {
                    user_id: localUser.id,
                    old_email: user.email!,
                    new_email: email,
                    expires_at: expiresAt,
                    updated_at: new Date()
                }
            });
        }

        // 2. Iniciar el proceso de cambio en Supabase
        const supabase = await createServerSideClient();
        const { data, error } = await supabase.auth.updateUser({ email: email });

        if (error) {
            // Si falla Supabase, eliminar la solicitud creada
            await prisma.email_change_requests.delete({
                where: { id: changeRequest.id }
            });
            return { error: error.message };
        }

        return { 
            success: true, 
            data,
            message: "Proceso de cambio iniciado. Confirma desde ambos emails.",
            new_email: email,
            request_id: changeRequest.id
        };

    } catch (error) {
        console.error("Error creating email change request:", error);
        return { error: "Error interno del servidor" };
    }
}