'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { resendEmailConfirmation } from '@/features/auth/actions/resend-email-confirmation';
import { toast } from 'sonner';

export function useResendCooldown(onSuccess?: () => void) {
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
            const result = await resendEmailConfirmation();
            
            if (result.success) {
                toast.success('Emails reenviados', {
                    description: result.message || 'Revisa tu bandeja de entrada y spam en ambos emails.',
                    duration: 5000
                });
                startResendCooldown();
                
                if (onSuccess) {
                    setTimeout(() => onSuccess(), 1500);
                }
            } else {
                toast.error('Error al reenviar', {
                    description: result.error || 'No se pudieron reenviar los emails',
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('❌ Error resending emails:', error);
            toast.error('Error inesperado', {
                description: 'Ocurrió un error al reenviar los emails',
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