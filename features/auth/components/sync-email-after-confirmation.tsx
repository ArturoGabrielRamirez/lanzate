import { prisma } from "@/utils/prisma";
import { getCurrentUser } from "../actions/get-user";

export default async function syncEmailAfterConfirmation() {
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { error: userError || "User not found" };
    }

    try {
        // Buscar el usuario local por el email anterior
        const existingRequest = await prisma.email_change_requests.findFirst({
            where: {
                OR: [
                    { old_email: user.email! },
                    { new_email: user.email! }
                ],
                completed: false
            },
            include: {
                users: true
            }
        });

        if (!existingRequest) {
            // Si no hay request pendiente, verificar si necesitamos actualizar el email local
            const localUser = await prisma.user.findFirst({
                where: {
                    email: {
                        not: user.email! // Email diferente
                    }
                }
            });

            if (localUser) {
                // Actualizar el email en la tabla local para que coincida con Supabase
                await prisma.user.update({
                    where: { id: localUser.id },
                    data: { 
                        email: user.email!,
                        updated_at: new Date()
                    }
                });

                return {
                    success: true,
                    message: "Email sincronizado correctamente"
                };
            }

            return { error: "No se encontró solicitud de cambio pendiente" };
        }

        // Si el email actual de Supabase coincide con el nuevo email solicitado
        if (user.email === existingRequest.new_email) {
            // Actualizar la tabla local de usuarios
            await prisma.user.update({
                where: { id: existingRequest.user_id },
                data: { 
                    email: user.email,
                    updated_at: new Date()
                }
            });

            // Marcar la solicitud como completada
            await prisma.email_change_requests.update({
                where: { id: existingRequest.id },
                data: {
                    completed: true,
                    completed_at: new Date(),
                    new_email_confirmed: true,
                    new_email_confirmed_at: new Date(),
                    updated_at: new Date()
                }
            });

            return {
                success: true,
                message: "Cambio de email completado y sincronizado"
            };
        }

        return { error: "El email no coincide con ninguna solicitud pendiente" };

    } catch (error) {
        console.error('Error syncing email:', error);
        return { error: "Error al sincronizar el email" };
    }
}