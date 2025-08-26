import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { LastResendInfo, UseResendEmailProps } from '../types';
import { resendEmailService } from '../services/resend-email-services';

export function useResendEmail({ email, type, emailChangeStatus }: UseResendEmailProps) {
    const [isResending, setIsResending] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [lastResendInfo, setLastResendInfo] = useState<LastResendInfo | null>(null);

    useEffect(() => {
        if (cooldownTime > 0) {
            const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldownTime]);

    const handleResendEmail = async () => {
        if (cooldownTime > 0) {
            toast.error(`Espera ${cooldownTime} segundos antes de reenviar`);
            return;
        }

        setIsResending(true);
        try {
            const result = await resendEmailService.resend({
                type,
                email,
                emailChangeStatus: emailChangeStatus?.status
            });

            toast.success(result.message);
            
            if (result.data) {
                setLastResendInfo({
                    email: result.data.email,
                    type: result.data.resendType || result.data.type,
                    reason: result.data.reason || ''
                });
            }
            
            setCooldownTime(60);
        } catch (error) {
            // El error ya se maneja en el service con toast
            console.error('Error in handleResendEmail:', error);
        } finally {
            setIsResending(false);
        }
    };

    // 🔥 NUEVO: Método específico para reenvío de email change
    const handleResendEmailChange = async (step?: 'old_email' | 'new_email') => {
        if (cooldownTime > 0) {
            toast.error(`Espera ${cooldownTime} segundos antes de reenviar`);
            return;
        }

        setIsResending(true);
        try {
            const result = await resendEmailService.resendEmailChange(step);
            
            toast.success(result.message);
            
            if (result.data) {
                setLastResendInfo({
                    email: result.data.email,
                    type: result.data.resendType || result.data.type,
                    reason: result.data.reason || ''
                });
            }
            
            setCooldownTime(60);
        } catch (error) {
            console.error('Error in handleResendEmailChange:', error);
        } finally {
            setIsResending(false);
        }
    };

    // 🔥 NUEVO: Método para reenvío inteligente (detecta automáticamente qué email reenviar)
    const handleSmartResend = async () => {
        if (!emailChangeStatus?.status) {
            toast.error('No hay información de cambio de email');
            return;
        }

        if (cooldownTime > 0) {
            toast.error(`Espera ${cooldownTime} segundos antes de reenviar`);
            return;
        }

        setIsResending(true);
        try {
            const result = await resendEmailService.resendSmart(emailChangeStatus.status);
            
            toast.success(result.message);
            
            if (result.data) {
                setLastResendInfo({
                    email: result.data.email,
                    type: result.data.resendType || result.data.type,
                    reason: result.data.reason || ''
                });
            }
            
            setCooldownTime(60);
        } catch (error) {
            console.error('Error in handleSmartResend:', error);
        } finally {
            setIsResending(false);
        }
    };

    return {
        isResending,
        cooldownTime,
        lastResendInfo,
        handleResendEmail, // Original method
        handleResendEmailChange, // 🔥 Nuevo método específico
        handleSmartResend, // 🔥 Nuevo método inteligente
        setCooldownTime
    };
}