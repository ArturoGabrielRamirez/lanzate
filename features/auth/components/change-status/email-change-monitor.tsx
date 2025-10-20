'use client'

import { Card, CardContent, CardHeader } from "@/features/shadcn/components/ui/card";
import { EmailChangeActions, EmailStepInstructions, EmailStepProgress } from "@/features/auth/components";
import { useEmailChangeStatus } from "@/features/auth/hooks/use-email-change-status";
import { useResendCooldown } from "@/features/auth/hooks/use-resend-cooldown";
import { EmailChangeMonitorProps } from "@/features/auth/types";

function EmailChangeMonitor({
    onComplete,
    initialOldEmail,
    newEmail
}: EmailChangeMonitorProps) {

    const { status, isManuallyChecking, handleManualCheck } = useEmailChangeStatus(initialOldEmail, onComplete);
    
    const resendParams = {
        type: 'email_change' as const,
        email: initialOldEmail,
        step: status.oldEmailConfirmed ? 'new_email' as const : 'old_email' as const
    };
    
    const { isResending, resendCooldown, handleResendEmails } = useResendCooldown(
        resendParams,
        handleManualCheck
    );

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
        <Card className="w-full max-w-md mx-auto bg-transparent border-none">
            <CardHeader className="text-center">
              {/*   <CardTitle className="flex items-center justify-center gap-2">
                                     
                </CardTitle> */}
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
                                ? `Podrás reenviar emails nuevamente en 
                                ${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, '0')}`
                                : 'Si no recibes los emails, verifica tu carpeta de spam o haz clic en "Reenviar emails"'
                            }
                        </p>
                    )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    La pagina se actualizara automaticamente cada 3 segundos
                </p>
            </CardContent>
        </Card>
    );
}

export { EmailChangeMonitor };