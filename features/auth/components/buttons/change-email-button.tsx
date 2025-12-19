'use client'

import { SetupPasswordPrompt } from '@/features/auth/components/change-visual/setup-password-prompt';
import { EmailChangeDialog, EmailChangeForm, ProgressButton } from '@/features/auth/components/index';
import { useEmailChange } from '@/features/auth/hooks/use-email-change';
import usePasswordGuard from '@/features/auth/hooks/use-password-guard';
import { changeEmailButtonSchema } from '@/features/auth/schemas/change-email-schema';
import { ChangeEmailButtonProps } from '@/features/auth/types';
import { ButtonWithPopup } from "@/features/global/components/button-with-popup";
import { Skeleton } from "@/features/shadcn/components/ui/skeleton";


function ChangeEmailButton({
    buttonText,
    title,
    /* className, */
    currentEmail,
    'data-action': dataAction
}: ChangeEmailButtonProps & { 'data-action'?: string }) {
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
            hasError: result.error,
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
                    data-action={dataAction}
                    text={buttonText}
                    title={title}
                    description="Por seguridad, confirma tu contraseña actual. Te enviaremos correos de verificación a ambas direcciones."
                    action={changeEmailAction}
                    schema={changeEmailButtonSchema}
                    messages={{
                        success: "Correos de verificación enviados",
                        error: "Error al cambiar el correo electrónico",
                        loading: "Enviando correos de verificación..."
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