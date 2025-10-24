"use server"

import { UpdateUserEmailConfirmedParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

export async function updateUserEmailConfirmedData({ newEmail, email, redirectTo, changeRequestId, userId }: UpdateUserEmailConfirmedParams) {
    const supabase = createServerSideClient()
    const { data, error } = await supabase.auth.updateUser(
        { email: email },
        {
            emailRedirectTo: redirectTo
        }
    );

    if (error) {
        await prisma.email_change_requests.delete({
            where: { id: changeRequestId }
        });
        return {
            hasError: true,
            message: error.message,
            payload: null
        };
    }
    try {
        await prisma.actionLog.create({
            data: {
                action: 'EMAIL_CHANGE_REQUEST',
                entity_type: 'EMAIL_CHANGE_REQUEST',
                entity_id: changeRequestId,
                user_id: userId,
                action_initiator: 'USER',
                details: `Email change requested from ${newEmail} to ${email}`
            }
        });
    } catch (logError) {
        console.error('⚠️ Failed to create action log:', logError);
    }

    return {
        hasError: false,
        message: "Email actualizado correctamente",
        payload: data
    };
}
