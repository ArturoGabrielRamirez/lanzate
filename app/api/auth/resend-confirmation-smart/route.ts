import { createServerSideClient } from '@/utils/supabase/server';
import { extractSubdomainFromHost } from '@/features/auth/utils';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { getCurrentUser } from '@/features/auth/actions/get-user';

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers();
        const host = headersList.get('host') || '';
        const subdomain = extractSubdomainFromHost(host);
        
        const supabase = createServerSideClient();
        const baseUrl = `${subdomain ? `https://${subdomain}.lanzate.app` : `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}`;

        // Obtener el usuario actual
        const { user, error: userError } = await getCurrentUser();
        
        if (userError || !user) {
            return NextResponse.json(
                { error: true, message: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Buscar usuario local
        let localUser = await prisma.user.findUnique({
            where: { supabase_user_id: user.id }
        });

        if (!localUser) {
            localUser = await prisma.user.findUnique({
                where: { email: user.email! }
            });
        }

        if (!localUser) {
            return NextResponse.json(
                { error: true, message: 'Usuario no encontrado en la base de datos local' },
                { status: 404 }
            );
        }

        console.log('🔍 Checking email change status for user:', localUser.id);

        // Buscar cambio de email activo
        const activeEmailChange = await prisma.email_change_requests.findFirst({
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

        if (!activeEmailChange) {
            // No hay cambio de email en proceso, verificar si necesita confirmación de signup
            if (!user.email_confirmed_at) {
                console.log('📧 Resending signup confirmation to:', user.email);
                
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: user.email!,
                    options: {
                        emailRedirectTo: `${baseUrl}/auth/confirm?next=/dashboard`
                    }
                });

                if (error) {
                    console.error('❌ Error resending signup confirmation:', error);
                    return NextResponse.json(
                        { error: true, message: error.message },
                        { status: 400 }
                    );
                }

                return NextResponse.json({
                    error: false,
                    message: 'Email de confirmación de registro reenviado',
                    data: {
                        type: 'signup',
                        email: user.email,
                        reason: 'Account not confirmed'
                    }
                });
            }

            return NextResponse.json(
                { error: true, message: 'No hay confirmaciones pendientes' },
                { status: 400 }
            );
        }

        console.log('📋 Active email change found:', {
            id: activeEmailChange.id,
            oldEmail: activeEmailChange.old_email,
            newEmail: activeEmailChange.new_email,
            oldConfirmed: activeEmailChange.old_email_confirmed,
            newConfirmed: activeEmailChange.new_email_confirmed
        });

        // Determinar qué email necesita confirmación
        let emailToResend: string;
        let resendType: 'old_email' | 'new_email';
        let message: string;

        if (!activeEmailChange.old_email_confirmed) {
            // Necesita confirmar email anterior
            emailToResend = activeEmailChange.old_email;
            resendType = 'old_email';
            message = 'Confirma tu email actual para continuar con el cambio';
            
            console.log('🔄 Resending confirmation to OLD email:', emailToResend);
            
        } else if (activeEmailChange.old_email_confirmed && !activeEmailChange.new_email_confirmed) {
            // Necesita confirmar email nuevo
            emailToResend = activeEmailChange.new_email;
            resendType = 'new_email';
            message = 'Confirma tu nuevo email para completar el cambio';
            
            console.log('🔄 Resending confirmation to NEW email:', emailToResend);
            
        } else {
            return NextResponse.json(
                { error: true, message: 'El cambio de email ya está completado' },
                { status: 400 }
            );
        }

        // Reenviar email de cambio
        const { error } = await supabase.auth.resend({
            type: 'email_change',
            email: emailToResend,
            options: {
                emailRedirectTo: `${baseUrl}/auth/confirm?next=/account`
            }
        });

        if (error) {
            console.error('❌ Error resending email change confirmation:', error);
            
            if (error.message.includes('rate limit')) {
                return NextResponse.json(
                    { error: true, message: 'Demasiadas solicitudes. Espera 5 minutos antes de intentar nuevamente.' },
                    { status: 429 }
                );
            }

            return NextResponse.json(
                { error: true, message: error.message },
                { status: 400 }
            );
        }

        console.log('✅ Email change confirmation resent successfully');

        return NextResponse.json({
            error: false,
            message: 'Email de confirmación reenviado exitosamente',
            data: {
                type: 'email_change',
                email: emailToResend,
                resendType,
                reason: message,
                requestId: activeEmailChange.id
            }
        });

    } catch (error) {
        console.error('❌ Internal error in smart resend:', error);
        return NextResponse.json(
            { error: true, message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}