import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/prisma";

type UpdateData = {
    old_email_confirmed?: boolean;
    old_email_confirmed_at?: Date;
    new_email_confirmed?: boolean;
    new_email_confirmed_at?: Date;
    completed?: boolean;
    completed_at?: Date;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, record } = body;

        // Verificar que sea un evento de autenticación relevante
        if (type !== 'INSERT' && type !== 'UPDATE') {
            return NextResponse.json({ status: 'ignored' });
        }

        // Solo procesar eventos relacionados con cambios de email
        if (!record.new_email && !record.email_change_confirm_status) {
            return NextResponse.json({ status: 'ignored' });
        }

        const supabaseUserId = record.id;
        const currentEmail = record.email;
        const newEmail = record.new_email;

        console.log('📧 Webhook received:', {
            type,
            supabaseUserId,
            currentEmail,
            newEmail,
            emailChangeConfirmStatus: record.email_change_confirm_status
        });

        // CAMBIO PRINCIPAL: Buscar por supabase_user_id primero
        let localUser = await prisma.user.findUnique({
            where: { 
                supabase_user_id: supabaseUserId 
            }
        });

        // Si no se encuentra por supabase_user_id, buscar por email y actualizar
        if (!localUser) {
            localUser = await prisma.user.findUnique({
                where: { email: currentEmail }
            });

            if (localUser) {
                // Actualizar el supabase_user_id para futuras consultas
                localUser = await prisma.user.update({
                    where: { id: localUser.id },
                    data: { 
                        supabase_user_id: supabaseUserId,
                        updated_at: new Date()
                    }
                });
            }
        }

        if (!localUser) {
            console.warn('❌ User not found:', { supabaseUserId, currentEmail });
            return NextResponse.json({ status: 'user_not_found' });
        }

        const changeRequest = await prisma.email_change_requests.findFirst({
            where: {
                user_id: localUser.id,
                completed: false,
                expires_at: {
                    gt: new Date()
                }
            }
        });

        if (!changeRequest) {
            return NextResponse.json({ status: 'no_active_request' });
        }

        const now = new Date();
        const updateData: UpdateData = {};
        let shouldUpdate = false;

        // Confirmar email anterior (cuando hay new_email pendiente)
        if (newEmail && !changeRequest.old_email_confirmed) {
            console.log('✅ Confirming old email for user:', localUser.id);
            updateData.old_email_confirmed = true;
            updateData.old_email_confirmed_at = now;
            shouldUpdate = true;
        }

        // Confirmar nuevo email y completar proceso (cuando new_email ya no existe)
        if (!newEmail && changeRequest.new_email && !changeRequest.completed) {
            console.log('✅ Completing email change for user:', localUser.id);
            updateData.new_email_confirmed = true;
            updateData.new_email_confirmed_at = now;
            updateData.completed = true;
            updateData.completed_at = now;
            shouldUpdate = true;

            // Actualizar el email en nuestra base de datos
            await prisma.user.update({
                where: { id: localUser.id },
                data: { 
                    email: changeRequest.new_email,
                    updated_at: new Date()
                }
            });
        }

        if (shouldUpdate) {
            const updatedRequest = await prisma.email_change_requests.update({
                where: { id: changeRequest.id },
                data: updateData
            });

            return NextResponse.json({ 
                status: 'updated',
                requestId: updatedRequest.id,
                changes: updateData
            });
        }

        return NextResponse.json({ status: 'no_changes' });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json({ 
            status: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}


/* import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/utils/prisma";

type UpdateData = {
    old_email_confirmed?: boolean;
    old_email_confirmed_at?: Date;
    new_email_confirmed?: boolean;
    new_email_confirmed_at?: Date;
    completed?: boolean;
    completed_at?: Date;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, record } = body;

        if (type !== 'INSERT' && type !== 'UPDATE') {
            return NextResponse.json({ status: 'ignored' });
        }
 
        if (!record.new_email && !record.email_change_confirm_status) {
            return NextResponse.json({ status: 'ignored' });
        }

        const userId = record.id;
        const currentEmail = record.email;
        const newEmail = record.new_email;
        const emailChangeConfirmStatus = record.email_change_confirm_status;

        console.log('📧 Webhook received:', {
            type,
            userId,
            currentEmail,
            newEmail,
            emailChangeConfirmStatus,
            emailConfirmedAt: record.email_confirmed_at,
            newEmailConfirmedAt: record.new_email_confirmed_at
        });

        const localUser = await prisma.user.findUnique({
            where: { 
                email: currentEmail
            }
        });

        if (!localUser) {
            return NextResponse.json({ status: 'user_not_found' });
        }

        const changeRequest = await prisma.email_change_requests.findFirst({
            where: {
                user_id: localUser.id,
                completed: false,
                expires_at: {
                    gt: new Date()
                }
            }
        });

        if (!changeRequest) {
            return NextResponse.json({ status: 'no_active_request' });
        }

        const now = new Date();
        const updateData: UpdateData  = {};
        let shouldUpdate = false;

        if (newEmail && !changeRequest.old_email_confirmed) {
            console.log('✅ Confirming old email for user:', localUser.id);
            updateData.old_email_confirmed = true;
            updateData.old_email_confirmed_at = now;
            shouldUpdate = true;
        }

        if (!newEmail && changeRequest.new_email && !changeRequest.completed) {
            updateData.new_email_confirmed = true;
            updateData.new_email_confirmed_at = now;
            updateData.completed = true;
            updateData.completed_at = now;
            shouldUpdate = true;

            await prisma.user.update({
                where: { id: localUser.id },
                data: { email: changeRequest.new_email }
            });
        }

        if (shouldUpdate) {
            const updatedRequest = await prisma.email_change_requests.update({
                where: { id: changeRequest.id },
                data: updateData
            });

            return NextResponse.json({ 
                status: 'updated',
                requestId: updatedRequest.id,
                changes: updateData
            });
        }

        return NextResponse.json({ status: 'no_changes' });

    } catch (error) {
        return NextResponse.json({ 
            status: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
} */