'use client'

import { ButtonWithPopup } from "@/features/layout/components";
import { emailSchema } from '../schemas/change-email-schema';
import { ChangeEmailButtonProps } from '../types';
import { useEmailChange } from "../hooks/use-email-change";
import { EmailChangeForm, EmailChangeDialog, ProgressButton } from "./index";

export default function ChangeEmailButton({
    buttonText,
    title,
    className,
    currentEmail
}: ChangeEmailButtonProps) {
    const {
        showMonitor,
        setShowMonitor,
        newEmail,
        hasPendingChange,
        changeEmailAction,
        handleMonitorComplete,
        handleShowMonitor,
        getProgressText,
        isProcessCompleted
    } = useEmailChange(currentEmail);

    return (
        <>
            <div className="flex items-center gap-2">
                <ButtonWithPopup
                    text={buttonText}
                    title={title}
                    description="Por seguridad, confirma tu contraseña actual. Te enviaremos emails de verificación a ambas direcciones."
                    action={changeEmailAction}
                    schema={emailSchema}
                    messages={{
                        success: "Emails de verificación enviados",
                        error: "Error al cambiar el email",
                        loading: "Enviando emails de verificación..."
                    }}
                    className={className}
                    variant="default"
                    onComplete={() => { }}
                    disabled={hasPendingChange && !isProcessCompleted}
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
    );
}