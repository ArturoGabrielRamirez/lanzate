'use client'

import { useEmailConfirmationDetector } from '../hooks/use-email-confirmation-detector';
import { useEffect, useState } from 'react';

export function GlobalEmailConfirmationDetector() {
    const [mounted, setMounted] = useState(false);

    // Evitar hidration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEmailConfirmationDetector({
        onFirstEmailConfirmed: () => {
            console.log('🎉 GlobalDetector: First email confirmed!');
            
            // Opcional: mostrar notificación toast global
            if (typeof window !== 'undefined') {
                // Crear una notificación temporal
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
                notification.textContent = 'Primer email confirmado! Revisa tu nuevo email.';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 5000);
            }
        },
        onSecondEmailConfirmed: () => {
            console.log('🎉 GlobalDetector: Second email confirmed!');
            
            if (typeof window !== 'undefined') {
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50';
                notification.textContent = '¡Email actualizado exitosamente!';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    document.body.removeChild(notification);
                    // Recargar la página para reflejar el cambio
                    window.location.reload();
                }, 3000);
            }
        }
    });

    if (!mounted) return null;
    
    return null; // No renderiza nada visible
}