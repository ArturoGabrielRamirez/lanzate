'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useResendCooldown } from "../hooks/use-resend-cooldown";
import { useEmailChangeStatus } from "../hooks/use-email-change-status";
import { EmailChangeMonitorProps } from "../types";
import { EmailChangeActions, EmailStepInstructions, EmailStepProgress } from "./index";


export default function EmailChangeMonitor({
    onComplete,
    initialOldEmail,
    newEmail
}: EmailChangeMonitorProps) {

    const { status, isManuallyChecking, handleManualCheck } = useEmailChangeStatus(initialOldEmail, onComplete);
    const { isResending, resendCooldown, handleResendEmails } = useResendCooldown(() => handleManualCheck());

    const getStepStatus = () => {
        if (!status.hasEmailChange) {
            return { step1: 'confirmed', step2: 'confirmed', currentStep: 'completed' };
        }
        if (status.oldEmailConfirmed) {
            return { step1: 'confirmed', step2: 'pending', currentStep: 'step2' };
        }
        return { step1: 'pending', step2: 'waiting', currentStep: 'step1' };
    };

    const stepStatus = getStepStatus();

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5" />
                    Confirmación de Cambio de Email
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <EmailStepProgress
                    status={status}
                    initialOldEmail={initialOldEmail}
                    newEmail={newEmail}
                />

                <EmailStepInstructions
                    stepStatus={stepStatus}
                    initialOldEmail={initialOldEmail}
                    newEmail={newEmail}
                />

                <div className="pt-4 space-y-2">
                    <EmailChangeActions
                        stepStatus={stepStatus}
                        isManuallyChecking={isManuallyChecking}
                        handleManualCheck={handleManualCheck}
                        status={status}
                        isResending={isResending}
                        resendCooldown={resendCooldown}
                        handleResendEmails={handleResendEmails}
                        onComplete={onComplete}
                    />

                    {stepStatus.currentStep !== 'completed' && (
                        <p className="text-xs text-muted-foreground text-center">
                            {resendCooldown > 0
                                ? `Podrás reenviar emails nuevamente en ${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, '0')}`
                                : 'Si no recibes los emails, verifica tu carpeta de spam o haz clic en "Reenviar emails"'
                            }
                        </p>
                    )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    La página se actualiza automáticamente cada 3 segundos
                </p>
            </CardContent>
        </Card>
    );
}