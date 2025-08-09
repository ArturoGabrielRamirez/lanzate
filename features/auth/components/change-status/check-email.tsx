'use client'

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useConfirmationEmailChangeStatus } from "@/features/auth/hooks/use-confirmation-email-change-status";
import { EmailChangeStatus } from "../../types";
import { Button } from "@/components/ui/button";
import { DotPattern } from '@/components/magicui/dot-pattern';
import { cn } from "@/lib/utils";

interface CheckEmailProps {
    email?: string;
    type?: 'signup' | 'recovery' | 'smart';
}

const defaultStatus: EmailChangeStatus = {
    hasEmailChange: false,
    oldEmailConfirmed: false,
    newEmailConfirmed: false,
    newEmail: null,
    currentEmail: '',
    loading: false,
    processCompleted: false,
    requestId: undefined,
    expiresAt: undefined,
    oldEmailConfirmedAt: null,
    newEmailConfirmedAt: null
};

export default function CheckEmail({ email, type = 'smart' }: CheckEmailProps) {
    const t = useTranslations("auth.check-email");
    const [isResending, setIsResending] = useState(false);
    const [hasResent, setHasResent] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [lastResendInfo, setLastResendInfo] = useState<{
        email: string;
        type: string;
        reason: string;
    } | null>(null);

    const emailChangeStatus: { status: EmailChangeStatus } =
        type === 'smart'
            ? useConfirmationEmailChangeStatus()
            : { status: defaultStatus };

    useEffect(() => {
        if (cooldownTime > 0) {
            const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldownTime]);

    const getTargetEmailAndMessage = () => {
        const { status } = emailChangeStatus;

        if (type === 'smart' && status.hasEmailChange) {
            if (!status.oldEmailConfirmed) {
                return {
                    targetEmail: status.currentEmail,
                    message: `Confirma tu email actual (${status.currentEmail}) para continuar`,
                    step: '1/2'
                };
            } else if (status.oldEmailConfirmed && !status.newEmailConfirmed) {
                return {
                    targetEmail: status.newEmail || '',
                    message: `Confirma tu nuevo email (${status.newEmail}) para completar el cambio`,
                    step: '2/2'
                };
            }
        }

        return {
            targetEmail: email || '',
            message: 'Te hemos enviado un enlace de confirmación',
            step: null
        };
    };

    const handleResendEmail = async () => {
        if (cooldownTime > 0) {
            toast.error(`Please wait ${cooldownTime} seconds before resending`);
            return;
        }

        setIsResending(true);

        try {
            const endpoint = '/api/auth/resend';
            let payload: any = {};

            if (type === 'smart') {
                const { status } = emailChangeStatus;

                let step: 'old_email' | 'new_email' | undefined;

                if (status.hasEmailChange) {
                    if (!status.oldEmailConfirmed) {
                        step = 'old_email';
                    } else if (status.oldEmailConfirmed && !status.newEmailConfirmed) {
                        step = 'new_email';
                    }
                }

                payload = {
                    type: 'email_change',
                    ...(step && { step })
                };
            } else if (type === 'recovery') {
                payload = {
                    type: 'recovery',
                    email
                };
            } else {
                payload = {
                    type: 'signup',
                    email
                };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Response is not JSON. Got:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response. Check server logs.');
            }

            const data = await response.json();

            if (!response.ok || data.error) {
                if (response.status === 404) {
                    toast.error("No user found with this email address.");
                } else if (response.status === 429) {
                    toast.error("Too many requests. Please wait a moment.");
                    setCooldownTime(300); // 5 minutes cooldown
                } else if (response.status === 401) {
                    toast.error("Usuario no autenticado. Por favor, inicia sesión.");
                } else if (data.message?.includes('already confirmed') || data.message?.includes('ya está confirmado')) {
                    toast.info("Email is already confirmed.");
                } else if (data.message?.includes('No hay confirmaciones pendientes')) {
                    toast.info("No pending confirmations.");
                } else {
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }
                return;
            }

            const successMessage = data.message || "Email reenviado exitosamente";
            toast.success(successMessage);

            if (data.data) {
                setLastResendInfo({
                    email: data.data.email,
                    type: data.data.resendType || data.data.type,
                    reason: data.data.reason || ''
                });
            }

            setHasResent(true);
            setCooldownTime(60);

        } catch (error) {
            console.error('Error al reenviar:', error);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Error desconocido al reenviar");
            }
        } finally {
            setIsResending(false);
        }
    };

    const { targetEmail, message, step } = getTargetEmailAndMessage();

    const getButtonText = () => {
        if (isResending) return 'Reenviando...';
        if (hasResent && cooldownTime > 0) return `Espera ${cooldownTime}s`;
        if (hasResent) return 'Reenviado ✓';
        return 'Reenviar email';
    };

    const isButtonDisabled = isResending || cooldownTime > 0;

    if (type === 'smart' && emailChangeStatus.status.loading) {
        return (
            <div className="p-8 text-center grow --color-background text-white flex flex-col items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                <p>Verificando estado del email...</p>
            </div>
        );
    }

    return (
        <div className="p-8 text-center grow text-white flex flex-col items-center justify-center h-dvh relative">
            <div className="max-w-md mx-auto space-y-6">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center 
                    justify-center bg-gradient-to-t from-chart-5 to-primary">
                        <svg className="w-10 h-10"
                            fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2
                             2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold mb-2 bg-color-red-500">
                        {type === 'recovery' ?
                            'Revisa tu email' :
                            'Confirma tu email'}
                        {step && <span className="text-sm font-normal text-blue-300 ml-2">({step})</span>}
                    </h2>

                    <p className="text-gray-300">{message}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="space-y-4">
                        <p className="text-sm opacity-80">
                            Email enviado a:
                        </p>
                        <p className="font-medium text-blue-300 break-all">
                            {targetEmail || 'Email no disponible'}
                        </p>

                        {lastResendInfo && (
                            <div className="text-xs text-gray-400 bg-white/5 rounded p-3 mt-3">
                                <p><strong>Último reenvío:</strong> {lastResendInfo.email}</p>
                                <p><strong>Tipo:</strong> {lastResendInfo.type === 'old_email' ?
                                    'Email actual' :
                                    lastResendInfo.type === 'new_email' ?
                                        'Email nuevo' :
                                        lastResendInfo.type}</p>
                                {lastResendInfo.reason && <p><strong>Razón:</strong> {lastResendInfo.reason}</p>}
                            </div>
                        )}

                        <p className="text-xs text-gray-400 leading-relaxed">
                            Haz clic en el enlace del email para continuar. Revisa también tu carpeta de spam.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="pt-4 border-t border-white/20">
                        <p className="text-sm mb-4 opacity-80">
                            ¿No recibiste el email?
                        </p>

                        <Button
                            onClick={handleResendEmail}
                            disabled={isButtonDisabled}
                            className={`
                                px-6 py-3 rounded-lg font-medium transition-all w-full bg-gradient-to-t from-chart-5 to-primary
                                ${cooldownTime > 0
                                    ? 'bg-yellow-600 text-white cursor-not-allowed'
                                    : hasResent && cooldownTime === 0
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : isResending
                                            ? 'bg-secondary-foreground text-white cursor-not-allowed'
                                            : 'bg-gradient-to-t from-chart-5 to-primary hover:bg-chart-1 text-white hover:scale-105'
                                }
                            `}
                        >
                            {getButtonText()}
                        </Button>

                        {hasResent && cooldownTime === 0 && (
                            <p className="text-sm text-green-400 mt-3 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Email reenviado - Revisa tu bandeja de entrada
                            </p>
                        )}

                        {cooldownTime > 0 && (
                            <p className="text-sm text-yellow-400 mt-2">
                                Puedes reenviar en {cooldownTime} segundos
                            </p>
                        )}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-400">
                        ¿Problemas con el email?{" "}
                        <a
                            href="mailto:soporte@lanzate.app"
                            className="text-blue-400 hover:text-blue-300 underline"
                        >
                            Contacta soporte
                        </a>
                    </p>
                </div>
            </div>
            <DotPattern
                width={30}
                height={30}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent_70%,transparent)] ",
                )} />
        </div>
    );
}