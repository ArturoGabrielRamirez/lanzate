'use client'

import { Button } from "@/components/ui/button";
import { RefreshCw, Send, CheckCircle } from "lucide-react";
import { EmailChangeActionsProps } from "../../types/index";

export default function EmailChangeActions({
    stepStatus,
    isManuallyChecking,
    handleManualCheck,
    status,
    isResending,
    resendCooldown,
    handleResendEmails,
    onComplete 
}: EmailChangeActionsProps) {
    const formatTime = (seconds: number) => {
        return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    };

    if (stepStatus.currentStep === 'completed') {
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">¡Cambio completado!</span>
                </div>
                <Button onClick={onComplete} className="w-full">
                    Volver a mi cuenta
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Button
                variant="outline"
                onClick={handleManualCheck}
                disabled={status.loading || isManuallyChecking}
                className={`w-full flex items-center gap-2 transition-all duration-300 ${
                    isManuallyChecking
                        ? 'scale-95 bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700'
                        : 'hover:scale-[1.02]'
                }`}
            >
                <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${
                    (status.loading || isManuallyChecking) ? 'animate-spin' : ''
                }`} />
                {isManuallyChecking
                    ? 'Verificando...'
                    : status.loading
                        ? 'Cargando...'
                        : 'Verificar estado'
                }
            </Button>

            <Button
                variant="secondary"
                onClick={handleResendEmails}
                disabled={isResending || status.loading || resendCooldown > 0}
                className={`w-full flex items-center gap-2 transition-all duration-200 ${
                    isResending ? 'scale-95' : 'hover:scale-[1.02]'
                } ${resendCooldown > 0 ? 'opacity-60' : ''}`}
                size="sm"
            >
                <Send className={`w-4 h-4 ${isResending ? 'animate-pulse' : ''}`} />
                {isResending
                    ? 'Reenviando...'
                    : resendCooldown > 0
                        ? `Espera ${formatTime(resendCooldown)}`
                        : 'Reenviar emails'
                }
            </Button>
        </div>
    );
}