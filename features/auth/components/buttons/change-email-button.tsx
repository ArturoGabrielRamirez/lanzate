'use client'

import { Skeleton } from "@/features/shadcn/components/ui/skeleton";
import { SetupPasswordPrompt } from '@/features/auth/components/change-visual/setup-password-prompt';
import { EmailChangeDialog, EmailChangeForm, ProgressButton } from '@/features/auth/components/index';
import { useEmailChange } from '@/features/auth/hooks/use-email-change';
import usePasswordGuard from '@/features/auth/hooks/use-password-guard';
import { changeEmailSchema } from '@/features/auth/schemas/change-email-schema';
import { ChangeEmailButtonProps } from '@/features/auth/types';
import { ButtonWithPopup } from "@/features/layout/components";


function ChangeEmailButton({
    buttonText,
    title,
    /* className, */
    currentEmail
}: ChangeEmailButtonProps) {
    const { hasPassword, loading, refreshPasswordStatus } = usePasswordGuard()
    const {
        showMonitor,
        setShowMonitor,
        newEmail,
        hasPendingChange,
        changeEmailAction: originalChangeEmailAction,
        handleMonitorComplete,
        handleShowMonitor,
        getProgressText,
        isProcessCompleted
    } = useEmailChange(currentEmail);

    // Wrapper que garantiza el tipo correcto
    async function changeEmailAction(formData: {
        currentPassword: string;
        email: string;
    }) {
        const result = await originalChangeEmailAction(formData);
        return {
            error: result.error,
            message: result.message ?? "Proceso completado",
            payload: formData
        };
    }

    if (loading) {
        return <Skeleton className="size-6 rounded" />
    }

    // Si no tiene contraseña, mostrar prompt para configurarla
    if (!hasPassword) {
        return (
            <SetupPasswordPrompt
                operationName="cambiar tu email"
                onPasswordSet={refreshPasswordStatus}
            />
        )
    }

    // Si tiene contraseña, mostrar el cambio normal
    return (
        <>
            <div className="flex items-center gap-2">
                <ButtonWithPopup
                    text={buttonText}
                    title={title}
                    description="Por seguridad, confirma tu contraseña actual. Te enviaremos emails de verificación a ambas direcciones."
                    action={changeEmailAction}
                    schema={changeEmailSchema}
                    messages={{
                        success: "Emails de verificación enviados",
                        error: "Error al cambiar el email",
                        loading: "Enviando emails de verificación..."
                    }}
                    /*  className={className} */
                    variant="default"
                    onComplete={() => { }}
                    disabled={hasPendingChange && !isProcessCompleted}
                    onlyIcon={true}
                >
                    <EmailChangeForm
                        currentEmail={currentEmail}
                        hasPendingChange={hasPendingChange}
                        isProcessCompleted={isProcessCompleted}
                    />
                </ButtonWithPopup>

                <ProgressButton
                    hasPendingChange={hasPendingChange}
                    isProcessCompleted={isProcessCompleted}
                    progressText={getProgressText()}
                    onShowMonitor={handleShowMonitor}
                />
            </div>

            <EmailChangeDialog
                showMonitor={showMonitor}
                onOpenChange={setShowMonitor}
                currentEmail={currentEmail}
                newEmail={newEmail}
                onComplete={handleMonitorComplete}
            />
        </>
    )
}

export { ChangeEmailButton };