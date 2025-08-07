'use server'

import { prisma } from '@/utils/prisma'
import { ResponseType } from '@/features/layout/types'
import { getCurrentUser } from '@/features/auth/actions/get-user'

export async function insertUser(
    email: string, 
    provider: string,
    supabaseUserId?: string // 👈 NUEVO PARÁMETRO OPCIONAL
): Promise<ResponseType<any>> {
    try {
        // Si no se proporciona supabaseUserId, intentar obtenerlo
        let finalSupabaseUserId = supabaseUserId;
        
        if (!finalSupabaseUserId) {
            const { user } = await getCurrentUser();
            finalSupabaseUserId = user?.id;
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    ...(finalSupabaseUserId ? [{ supabase_user_id: finalSupabaseUserId }] : [])
                ]
            }
        });

        if (existingUser) {
            // Si existe pero no tiene supabase_user_id, actualizarlo
            if (!existingUser.supabase_user_id && finalSupabaseUserId) {
                const updatedUser = await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        supabase_user_id: finalSupabaseUserId,
                        email: email, // Sincronizar email también
                        updated_at: new Date()
                    },
                    include: {
                        Account: true
                    }
                });
                
                return {
                    error: false,
                    message: 'User updated successfully',
                    payload: updatedUser
                };
            }

            return {
                error: true,
                message: 'User already exists',
                payload: null
            };
        }

        // Crear nuevo usuario
        const newUser = await prisma.user.create({
            data: {
                email,
                supabase_user_id: finalSupabaseUserId, // 👈 GUARDAR SUPABASE_USER_ID
                password: provider === 'email' ? 'oauth_user' : 'oauth_user', // Placeholder para OAuth
                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                Account: true
            }
        });

        // Crear cuenta gratuita por defecto
        await prisma.account.create({
            data: {
                user_id: newUser.id,
                type: 'FREE',
                created_at: new Date(),
                updated_at: new Date(),
            }
        });

        return {
            error: false,
            message: 'User created successfully',
            payload: newUser
        };

    } catch (error) {
        console.error('Error in insertUser:', error);
        return {
            error: true,
            message: 'Error inserting user',
            payload: null
        };
    }
}