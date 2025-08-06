'use client'

import { useEmailConfirmationDetector } from '../hooks/use-email-confirmation-detector';
import { useEffect, useState } from 'react';

export default function GlobalEmailConfirmationDetector() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEmailConfirmationDetector({
        onFirstEmailConfirmed: () => {
            if (typeof window !== 'undefined') {
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
            if (typeof window !== 'undefined') {
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50';
                notification.textContent = '¡Email actualizado exitosamente!';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    document.body.removeChild(notification);
                    window.location.reload();
                }, 3000);
            }
        }
    });

    if (!mounted) return null;
    
    return null;
}