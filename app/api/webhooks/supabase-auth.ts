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

        // Verificar que sea un evento de autenticación
        if (type !== 'INSERT' && type !== 'UPDATE') {
            return NextResponse.json({ status: 'ignored' });
        }

        // Solo procesar eventos relacionados con cambios de email
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

        // Buscar el usuario en nuestra base de datos usando el email actual
        const localUser = await prisma.user.findUnique({
            where: { 
                email: currentEmail // Usar el email único como identificador
            }
        });

        if (!localUser) {
            console.log('❌ Local user not found for email:', currentEmail);
            return NextResponse.json({ status: 'user_not_found' });
        }

        // Buscar solicitud de cambio activa
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
            console.log('❌ No active change request found for user:', localUser.id);
            return NextResponse.json({ status: 'no_active_request' });
        }

        const now = new Date();
        const updateData: UpdateData  = {};
        let shouldUpdate = false;

        // Detectar confirmación del email antiguo
        // Esto ocurre cuando el usuario hace clic en el primer email
        if (newEmail && !changeRequest.old_email_confirmed) {
            console.log('✅ Confirming old email for user:', localUser.id);
            updateData.old_email_confirmed = true;
            updateData.old_email_confirmed_at = now;
            shouldUpdate = true;
        }

        // Detectar confirmación del email nuevo
        // Esto ocurre cuando el proceso se completa (new_email se vuelve null)
        if (!newEmail && changeRequest.new_email && !changeRequest.completed) {
            console.log('✅ Confirming new email and completing process for user:', localUser.id);
            updateData.new_email_confirmed = true;
            updateData.new_email_confirmed_at = now;
            updateData.completed = true;
            updateData.completed_at = now;
            shouldUpdate = true;

            // IMPORTANTE: También actualizar el email en tu tabla local
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

            console.log('✅ Updated email change request:', updatedRequest);

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