import { InputField } from "@/features/layout/components";
import { EmailStatusAlerts } from "../index";
import { EmailChangeFormProps } from "../../types";

export default function EmailChangeForm({
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
                label="Nuevo email"
                type="email"
                placeholder="nuevo-email@ejemplo.com"
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