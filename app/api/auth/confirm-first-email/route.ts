import { NextRequest, NextResponse } from 'next/server';
import { createServerSideClient } from '@/utils/supabase/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: NextRequest) {
    try {
        console.log('📧 Processing first email confirmation...');
        
        // Obtener el usuario actual
        const supabase = await createServerSideClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            console.error('❌ User not found:', userError);
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
        }

        console.log('👤 Current user:', {
            id: user.id,
            email: user.email,
            newEmail: user.new_email
        });

        // Buscar el usuario local por email
        const localUser = await prisma.user.findFirst({
            where: { email: user.email }
        });

        if (!localUser) {
            console.error('❌ Local user not found for email:', user.email);
            return NextResponse.json({ error: 'Usuario local no encontrado' }, { status: 404 });
        }

        // Buscar la solicitud de cambio de email activa
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
            console.error('❌ No active email change request found for user:', localUser.id);
            return NextResponse.json({ error: 'No hay solicitud de cambio activa' }, { status: 404 });
        }

        console.log('📋 Found change request:', {
            id: changeRequest.id,
            oldEmail: changeRequest.old_email,
            newEmail: changeRequest.new_email,
            oldEmailConfirmed: changeRequest.old_email_confirmed,
            newEmailConfirmed: changeRequest.new_email_confirmed
        });

        // Verificar si ya está confirmado
        if (changeRequest.old_email_confirmed) {
            console.log('ℹ️ First email already confirmed for request:', changeRequest.id);
            return NextResponse.json({ 
                success: true,
                message: 'Primer email ya confirmado',
                alreadyConfirmed: true 
            });
        }

        // Verificar que el usuario tenga un new_email pendiente en Supabase
        if (!user.new_email) {
            console.log('❌ No new_email found in Supabase user object');
            return NextResponse.json({ error: 'No hay cambio de email pendiente' }, { status: 400 });
        }

        // Actualizar la solicitud para marcar el primer email como confirmado
        const updatedRequest = await prisma.email_change_requests.update({
            where: { id: changeRequest.id },
            data: {
                old_email_confirmed: true,
                old_email_confirmed_at: new Date(),
                updated_at: new Date()
            }
        });

        console.log('✅ First email confirmation updated successfully:', {
            requestId: updatedRequest.id,
            userId: localUser.id,
            oldEmail: updatedRequest.old_email,
            newEmail: updatedRequest.new_email
        });

        // Crear log de la acción
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
        console.error('❌ Error processing first email confirmation:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' }, 
            { status: 500 }
        );
    }
}