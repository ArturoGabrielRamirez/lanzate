import { EmailStatusAlerts } from "@/features/auth/components"
import { EmailChangeFormProps } from "@/features/auth/types"
import { InputField } from "@/features/global/components/form/input-field";

function EmailChangeForm({
    currentEmail,
    hasPendingChange,
    isProcessCompleted
}: EmailChangeFormProps) {
    return (
        <>
            <EmailStatusAlerts
                currentEmail={currentEmail}
                hasPendingChange={hasPendingChange}
                isProcessCompleted={isProcessCompleted}
            />

            <InputField
                name="email"
                label="Nuevo correo electrónico"
                type="email"
                placeholder="nuevo-correo@ejemplo.com"
                disabled={hasPendingChange && !isProcessCompleted}
            />
            <InputField
                name="currentPassword"
                label="Contraseña actual"
                type="password"
                placeholder="Tu contraseña actual"
                disabled={hasPendingChange && !isProcessCompleted}
            />
        </>
    );
}

export { EmailChangeForm };