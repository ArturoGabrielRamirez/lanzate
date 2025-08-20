import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { LastResendInfo, UseResendEmailProps } from '../types';

import { resendEmailService } from '../services/resend-email-serveces';


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
            toast.error(`Please wait ${cooldownTime} seconds before resending`);
            return;
        }

        setIsResending(true);

        try {
            const result = await resendEmailService.resend({
                type,
                email,
                emailChangeStatus: emailChangeStatus.status
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
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error desconocido al reenviar");
            }
        } finally {
            setIsResending(false);
        }
    };

    return {
        isResending,
        cooldownTime,
        lastResendInfo,
        handleResendEmail,
        setCooldownTime
    };
}