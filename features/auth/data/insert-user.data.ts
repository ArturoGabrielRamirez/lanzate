'use server'

import { getCurrentUserAction } from '@/features/auth/actions'
import { detectOAuthProvider } from "@/features/auth/utils/detect-provider";
import { prisma } from '@/utils/prisma'

export async function insertUser({ email, provider, supabaseUserId, avatar, username, name, lastname, phone }: { email: string, provider?: string, supabaseUserId?: string, avatar?: string, username?: string, name?: string, lastname?: string, phone?: string }) {
    let finalSupabaseUserId = supabaseUserId;

    if (!finalSupabaseUserId) {
        const { payload: user } = await getCurrentUserAction();
        finalSupabaseUserId = user?.id;
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                ...(finalSupabaseUserId ? [{ supabase_user_id: finalSupabaseUserId }] : [])
            ]
        }
    });

    if (existingUser) {
        if (!existingUser.supabase_user_id && finalSupabaseUserId) {
            const updatedUser = await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    supabase_user_id: finalSupabaseUserId,
                    email: email,
                    updated_at: new Date()
                },
                include: {
                    Account: true
                }
            });

            return {
                hasError: false,
                message: 'User updated successfully',
                payload: updatedUser
            };
        }

        throw new Error('User already exists');
    }

    const detectedProvider = detectOAuthProvider(email, provider);

    const newUser = await prisma.user.create({
        data: {
            email,
            avatar: avatar || null,
            created_at: new Date(),
            first_name: name || null,
            last_name: lastname || null,
            password: detectedProvider,
            updated_at: new Date(),
            supabase_user_id: finalSupabaseUserId,
            phone: phone || null,
            username: username || "",
        },
        include: {
            Account: true
        }
    });

    await prisma.account.create({
        data: {
            user_id: newUser.id,
            type: 'FREE',
            created_at: new Date(),
            updated_at: new Date(),
        }
    });

    return {
        hasError: false,
        message: 'User created successfully',
        payload: newUser
    };

}