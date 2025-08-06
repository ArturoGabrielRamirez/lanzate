'use client'

import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import { useEmailChangeStatus } from '../hooks/use-email-changue-status';
import { useEmailConfirmationDetector } from '../hooks/use-email-confirmation-detector';

export function EmailStatusBanner() {
    const { status, refreshStatus } = useEmailChangeStatus();

    // Configurar el detector de confirmaciones
    useEmailConfirmationDetector({
        onFirstEmailConfirmed: () => {
            console.log('🎉 First email confirmed! Refreshing status...');
            // Refrescar el estado después de un breve delay
            setTimeout(() => {
                refreshStatus();
            }, 1000);
        },
        onSecondEmailConfirmed: () => {
            console.log('🎉 Second email confirmed! Refreshing status...');
            setTimeout(() => {
                refreshStatus();
                // Opcional: recargar la página para mostrar el email actualizado
                window.location.reload();
            }, 1000);
        }
    });

    if (!status.hasEmailChange || status.loading) {
        return null;
    }

    if (status.processCompleted || (status.oldEmailConfirmed && status.newEmailConfirmed)) {
        return (
            <Alert className="mb-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                    ¡Email actualizado exitosamente! Ya puedes usar {status.currentEmail}
                </AlertDescription>
            </Alert>
        );
    }

    if (status.oldEmailConfirmed && !status.newEmailConfirmed) {
        return (
            <Alert className="mb-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                    <strong>Último paso:</strong> Revisa tu nuevo email ({status.newEmail}) y confirma para completar el cambio.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Alert className="mb-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                <strong>Cambio de email en progreso:</strong> Confirma desde tu email actual ({status.currentEmail}) para continuar.
            </AlertDescription>
        </Alert>
    );
}