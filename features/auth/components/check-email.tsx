'use client'

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CheckEmailProps {
    email?: string;
    type?: 'signup' | 'recovery';
}

export default function CheckEmail({ email, type = 'signup' }: CheckEmailProps) {
    const t = useTranslations("auth.check-email");
    const [isResending, setIsResending] = useState(false);
    const [hasResent, setHasResent] = useState(false);


    const handleResendEmail = async () => {
        if (!email) {
            toast.error("No email address available to resend");
            return;
        }

        setIsResending(true);

        try {
            const endpoint = type === 'recovery'
                ? '/api/auth/resend-recovery'
                : '/api/auth/resend-confirmation';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, type })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Response is not JSON. Got:', text.substring(0, 200));
                throw new Error('Server returned non-JSON response. Check server logs.');
            }

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            const successMessage = type === 'recovery'
                ? "Email de recuperación reenviado exitosamente"
                : "Email de confirmación reenviado exitosamente";

            toast.success(successMessage);
            setHasResent(true);
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

    const getMessages = () => {
        if (type === 'recovery') {
            return {
                title: "Revisa tu email",
                subtitle: "Te hemos enviado un enlace de recuperación de contraseña.",
                notReceived: "¿No recibiste el email de recuperación?",
                buttonText: "Reenviar recuperación",
                sentTo: "Enlace enviado a:"
            };
        } else {
            return {
                title: "Revisa tu email",
                subtitle: "Te hemos enviado un enlace de confirmación de cuenta.",
                notReceived: "¿No recibiste el email de confirmación?",
                buttonText: "Reenviar confirmación",
                sentTo: "Confirmación enviada a:"
            };
        }
    };

    const messages = getMessages();

    return (
        <div className="p-8 text-center grow --color-background text-white flex flex-col items-center justify-center">
            <div className="max-w-md mx-auto space-y-6">
                <h2 className="text-2xl font-bold mb-4">{messages.title}</h2>
                <p className="mb-6">{messages.subtitle}</p>
                <div className="space-y-4">
                    <p className="text-sm opacity-80">
                        {messages.sentTo} <span className="font-medium">{email || 'Email no disponible'}</span>
                    </p>
                    <div className="pt-4 border-t border-white/20">
                        <p className="text-sm mb-4 opacity-80">
                            {messages.notReceived}
                        </p>

                        <button
                            onClick={handleResendEmail}
                            disabled={isResending || hasResent || !email}
                            className={`
                                px-6 py-2 rounded-lg font-medium transition-all
                                ${!email
                                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                                    : hasResent
                                        ? 'bg-green-600 text-white cursor-not-allowed'
                                        : isResending
                                            ? 'bg-gray-600 text-white cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                                }
                            `}
                        >
                            {!email
                                ? 'Sin email'
                                : isResending
                                    ? 'Reenviando...'
                                    : hasResent
                                        ? 'Reenviado'
                                        : messages.buttonText
                            }
                        </button>

                        {hasResent && (
                            <p className="text-sm text-green-400 mt-2">
                                Revisa tu bandeja de entrada nuevamente
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}