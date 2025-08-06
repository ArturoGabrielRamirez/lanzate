import { NextRequest, NextResponse } from 'next/server';
import { createServerSideClient } from '@/utils/supabase/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: NextRequest) {

    if (request.method !== 'POST') {
        return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
    }
    try {
        const supabase = await createServerSideClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
        }

        const localUser = await prisma.user.findFirst({
            where: { email: user.email }
        });

        if (!localUser) {
            return NextResponse.json({ error: 'Usuario local no encontrado' }, { status: 404 });
        }

        const changeRequest = await prisma.email_change_requests.findFirst({
            where: {
                user_id: localUser.id,
                completed: false,
                expires_at: {
                    gt: new Date()
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        if (!changeRequest) {
            return NextResponse.json({ error: 'No hay solicitud de cambio activa' }, { status: 404 });
        }

        if (changeRequest.old_email_confirmed) {
            return NextResponse.json({
                success: true,
                message: 'Primer email ya confirmado',
                alreadyConfirmed: true
            });
        }

        if (!user.new_email) {
            return NextResponse.json({ error: 'No hay cambio de email pendiente' }, { status: 400 });
        }

        const updatedRequest = await prisma.email_change_requests.update({
            where: { id: changeRequest.id },
            data: {
                old_email_confirmed: true,
                old_email_confirmed_at: new Date(),
                updated_at: new Date()
            }
        });

        try {
            await prisma.actionLog.create({
                data: {
                    action: 'EMAIL_CONFIRMATION',
                    entity_type: 'EMAIL_CHANGE_REQUEST',
                    entity_id: updatedRequest.id,
                    user_id: localUser.id,
                    action_initiator: 'USER',
                    details: `First email confirmed for change from ${updatedRequest.old_email} to ${updatedRequest.new_email}`
                }
            });
        } catch (logError) {
            console.warn('⚠️ Failed to create action log:', logError);
        }

        return NextResponse.json({
            success: true,
            message: 'Primer email confirmado exitosamente',
            data: {
                requestId: updatedRequest.id,
                oldEmailConfirmed: true,
                newEmailConfirmed: updatedRequest.new_email_confirmed,
                nextStep: 'Ahora confirma desde tu nuevo email'
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}