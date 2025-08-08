'use client'

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Mail, RefreshCw } from 'lucide-react';
import { useConfirmationEmailChangeStatus } from '../hooks/use-confirmation-email-change-status';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export default function EmailStatusBanner() {
    const { status } = useConfirmationEmailChangeStatus();
    const [isResending, setIsResending] = useState(false);
    const t = useTranslations("Auth");

    const handleSmartResend = async () => {
        setIsResending(true);
        
        try {
            const response = await fetch('/api/auth/resend-confirmation-smart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                if (response.status === 429) {
                    toast.error("Demasiadas solicitudes. Espera 5 minutos.");
                } else {
                    toast.error(data.message || "Error al reenviar email");
                }
                return;
            }

            // Success
            toast.success(data.message);
            
            // Show specific information about what was resent
            if (data.data) {
                const { email, resendType, reason } = data.data;
                const typeLabel = resendType === 'old_email' ? 'email actual' : 
                                 resendType === 'new_email' ? 'email nuevo' : 
                                 'email';
                
                setTimeout(() => {
                    toast.info(`Reenviado a tu ${typeLabel}: ${email}`);
                }, 1000);
            }

        } catch (error) {
            console.error('Error resending:', error);
            toast.error("Error de conexión al reenviar email");
        } finally {
            setIsResending(false);
        }
    };

    if (!status.hasEmailChange || status.loading) {
        return null;
    }

    // Proceso completado
    if (status.processCompleted || (status.oldEmailConfirmed && status.newEmailConfirmed)) {
        return (
            <Alert className="mb-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                    <div className="flex items-center justify-between">
                        <span>
                            {t("updated-successfully", { email: status.currentEmail })}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.reload()}
                            className="ml-4 h-6 text-xs"
                        >
                            Actualizar página
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        );
    }

    // Esperando confirmación del nuevo email (paso 2/2)
    if (status.oldEmailConfirmed && !status.newEmailConfirmed) {
        return (
            <Alert className="mb-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex-1">
                            <strong>Último paso (2/2):</strong> {t("last-step", { email: status.newEmail || '' })}
                            <div className="text-sm opacity-75 mt-1">
                                Tu email actual ya fue confirmado. Ahora confirma tu nuevo email.
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSmartResend}
                            disabled={isResending}
                            className="h-7 text-xs shrink-0"
                        >
                            {isResending ? (
                                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                                <Mail className="h-3 w-3 mr-1" />
                            )}
                            Reenviar
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        );
    }

    // Esperando confirmación del email actual (paso 1/2)
    return (
        <Alert className="mb-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex-1">
                        <strong>Cambio de email en progreso (1/2):</strong> {t("change-in-progress", { email: status.currentEmail })}
                        <div className="text-sm opacity-75 mt-1">
                            Confirma tu email actual para continuar con el cambio a: <strong>{status.newEmail}</strong>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSmartResend}
                        disabled={isResending}
                        className="h-7 text-xs shrink-0"
                    >
                        {isResending ? (
                            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                            <Mail className="h-3 w-3 mr-1" />
                        )}
                        Reenviar
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}