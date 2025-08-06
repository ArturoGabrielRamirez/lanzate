'use client'

import { useState, useRef, useEffect } from 'react';
import { resendEmailConfirmation } from '@/features/auth/actions/resend-email-confirmation';
import { toast } from 'sonner';

export function useResendCooldown(onSuccess: () => void) {
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startResendCooldown = () => {
        setResendCooldown(60);
        
        cooldownIntervalRef.current = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    if (cooldownIntervalRef.current) {
                        clearInterval(cooldownIntervalRef.current);
                        cooldownIntervalRef.current = null;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendEmails = async () => {
        if (resendCooldown > 0) return;
        
        setIsResending(true);
        try {
            const result = await resendEmailConfirmation();
            
            if (result.success) {
                toast.success('Emails reenviados', {
                    description: 'Revisa tu bandeja de entrada y spam en ambos emails.',
                    duration: 5000
                });
                startResendCooldown();
                if (onSuccess) {
                    setTimeout(() => onSuccess(), 1000);
                }
            } else {
                toast.error('Error al reenviar', {
                    description: result.error || 'No se pudieron reenviar los emails',
                    duration: 5000
                });
            }
        } catch (error) {
            toast.error('Error inesperado', {
                description: 'Ocurrió un error al reenviar los emails',
                duration: 5000
            });
        } finally {
            setIsResending(false);
        }
    };

    useEffect(() => {
        return () => {
            if (cooldownIntervalRef.current) {
                clearInterval(cooldownIntervalRef.current);
                cooldownIntervalRef.current = null;
            }
        };
    }, []);

    return {
        isResending,
        resendCooldown,
        handleResendEmails
    };
}