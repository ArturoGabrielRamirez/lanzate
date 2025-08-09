'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ResendEmailParams {
    type: 'signup' | 'recovery' | 'email_change';
    email?: string;
    step?: 'old_email' | 'new_email';
}

export function useResendCooldown(
    resendParams: ResendEmailParams,
    onSuccess?: () => void
) {
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    const clearCooldownInterval = useCallback(() => {
        if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
        }
    }, []);

    const startResendCooldown = useCallback(() => {
        if (!mountedRef.current) return;
        
        setResendCooldown(60);
        clearCooldownInterval();
        
        cooldownIntervalRef.current = setInterval(() => {
            if (!mountedRef.current) {
                clearCooldownInterval();
                return;
            }
            
            setResendCooldown(prev => {
                if (prev <= 1) {
                    clearCooldownInterval();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [clearCooldownInterval]);

    const handleResendEmails = async () => {
        if (resendCooldown > 0 || isResending) return;
        
        setIsResending(true);
        
        try {
            console.log('🔄 Resending email via unified API with params:', resendParams);

            const response = await fetch('/api/auth/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resendParams)
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                // Handle specific error cases
                if (response.status === 404) {
                    toast.error('Usuario no encontrado', {
                        description: 'No se encontró un usuario con este email',
                        duration: 5000
                    });
                } else if (response.status === 429) {
                    toast.error('Demasiadas solicitudes', {
                        description: 'Espera 5 minutos antes de intentar nuevamente',
                        duration: 5000
                    });
                } else if (response.status === 401) {
                    toast.error('No autenticado', {
                        description: 'Por favor, inicia sesión para continuar',
                        duration: 5000
                    });
                } else if (data.message?.includes('already confirmed') || 
                          data.message?.includes('ya está confirmado')) {
                    toast.info('Email ya confirmado', {
                        description: 'El email ya está confirmado',
                        duration: 5000
                    });
                } else if (data.message?.includes('No hay confirmaciones pendientes')) {
                    toast.info('Sin confirmaciones pendientes', {
                        description: 'No hay confirmaciones de email pendientes',
                        duration: 5000
                    });
                } else {
                    toast.error('Error al reenviar', {
                        description: data.message || 'No se pudo reenviar el email',
                        duration: 5000
                    });
                }
                return;
            }

            // Success handling
            const successMessage = data.message || 'Email reenviado exitosamente';
            toast.success('Email reenviado', {
                description: successMessage,
                duration: 5000
            });

            // Show specific information about what was resent
            if (data.data) {
                const { email, resendType, type, /* reason */ } = data.data;
                let detailMessage = '';

                if (resendType === 'old_email') {
                    detailMessage = `Reenviado a tu email actual: ${email}`;
                } else if (resendType === 'new_email') {
                    detailMessage = `Reenviado a tu email nuevo: ${email}`;
                } else if (type === 'signup') {
                    detailMessage = `Confirmación de registro enviada a: ${email}`;
                } else if (type === 'recovery') {
                    detailMessage = `Email de recuperación enviado a: ${email}`;
                } else {
                    detailMessage = `Email enviado a: ${email}`;
                }

                setTimeout(() => {
                    toast.info('Detalles del envío', {
                        description: detailMessage,
                        duration: 4000
                    });
                }, 1000);
            }

            startResendCooldown();
            
            if (onSuccess) {
                setTimeout(() => onSuccess(), 1500);
            }

        } catch (error) {
            console.error('❌ Error resending emails:', error);
            toast.error('Error inesperado', {
                description: 'Ocurrió un error al reenviar el email',
                duration: 5000
            });
        } finally {
            if (mountedRef.current) {
                setIsResending(false);
            }
        }
    };

    useEffect(() => {
        mountedRef.current = true;
        
        return () => {
            mountedRef.current = false;
            clearCooldownInterval();
        };
    }, [clearCooldownInterval]);

    return {
        isResending,
        resendCooldown,
        handleResendEmails,
        canResend: resendCooldown === 0 && !isResending
    };
}