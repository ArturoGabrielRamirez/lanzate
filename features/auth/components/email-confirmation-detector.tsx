'use client'

import { useEmailConfirmationDetector } from '../hooks/use-email-confirmation-detector';

export function EmailConfirmationDetector() {
    // Este componente no renderiza nada, solo ejecuta la lógica de detección
    useEmailConfirmationDetector({
        onFirstEmailConfirmed: () => {
            console.log('🎉 EmailConfirmationDetector: First email confirmed!');
            // Opcional: mostrar una notificación toast
            // toast.success('Primer email confirmado! Ahora confirma desde tu nuevo email.');
        },
        onSecondEmailConfirmed: () => {
            console.log('🎉 EmailConfirmationDetector: Second email confirmed!');
            // Opcional: mostrar una notificación toast
            // toast.success('¡Email actualizado exitosamente!');
        }
    });

    return null; // No renderiza nada visible
}