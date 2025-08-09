import { EmailStatusAlertsProps } from "../../types";

export default function EmailStatusAlerts({
    currentEmail,
    hasPendingChange,
    isProcessCompleted
}: EmailStatusAlertsProps) {
    return (
        <>
            <div className="mb-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Email actual:</strong> {currentEmail} {/* poner asteriscos */}
                </p>
            </div>

            {hasPendingChange && !isProcessCompleted && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        <strong>⚠️ Hay un cambio en progreso</strong><br />
                        Completa el proceso actual antes de iniciar uno nuevo.
                    </p>
                </div>
            )}

            {hasPendingChange && isProcessCompleted && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 rounded-md">
                    <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>✅ Cambio completado</strong><br />
                        Tu email ha sido actualizado exitosamente. Puedes iniciar un nuevo cambio si es necesario.
                    </p>
                </div>
            )}
        </>
    );
}