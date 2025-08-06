'use client'

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface EmailConfirmationDetectorProps {
    onFirstEmailConfirmed?: () => void;
    onSecondEmailConfirmed?: () => void;
}

export function useEmailConfirmationDetector({ 
    onFirstEmailConfirmed, 
    onSecondEmailConfirmed 
}: EmailConfirmationDetectorProps = {}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const processedRef = useRef(false);

    useEffect(() => {
        // Evitar procesamiento múltiple
        if (processedRef.current) return;

        // Función para limpiar la URL
        const cleanupUrl = () => {
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('message');
                url.hash = '';
                window.history.replaceState({}, '', url.toString());
                console.log('🧹 URL cleaned up');
            }
        };

        // Obtener mensajes tanto de searchParams como del hash
        const urlMessage = searchParams?.get('message');
        const hashMessage = typeof window !== 'undefined' ? 
            new URLSearchParams(window.location.hash.substring(1)).get('message') : null;

        const confirmationMessage = urlMessage || hashMessage;

        console.log('🔍 Checking for confirmation messages:', {
            urlMessage,
            hashMessage,
            finalMessage: confirmationMessage,
            fullUrl: typeof window !== 'undefined' ? window.location.href : 'N/A'
        });

        if (confirmationMessage) {
            console.log('📧 Processing confirmation message:', confirmationMessage);
            
            // Detectar confirmación del primer email
            if (confirmationMessage.includes('Confirmation link accepted') && 
                confirmationMessage.includes('Please proceed to confirm link sent to the other email')) {
                
                console.log('✅ First email confirmation detected!');
                processedRef.current = true;
                
                // Llamar función de callback si existe
                onFirstEmailConfirmed?.();
                
                // Actualizar el estado en la base de datos
                handleFirstEmailConfirmation();
                
                // Limpiar la URL y redirigir a account
                cleanupUrl();
                
                // Redirigir a la página de cuenta con un mensaje de éxito
                setTimeout(() => {
                    router.push('/account?emailStep=1');
                }, 1000);
            }
            // Detectar confirmación del segundo email
            else if (confirmationMessage.includes('Email updated successfully') || 
                     confirmationMessage.includes('Email confirmed successfully')) {
                
                console.log('✅ Second email confirmation detected!');
                processedRef.current = true;
                
                onSecondEmailConfirmed?.();
                
                cleanupUrl();
                
                // Redirigir a la página de cuenta
                setTimeout(() => {
                    router.push('/account?emailStep=2');
                }, 1000);
            }
        }
    }, [searchParams, onFirstEmailConfirmed, onSecondEmailConfirmed, router]);

    const handleFirstEmailConfirmation = async () => {
        try {
            console.log('📤 Updating first email confirmation status...');
            
            // Cambiamos la ruta a la que existe en tu estructura
            const response = await fetch('/api/auth/confirm-first-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ First email confirmation updated:', result);
                
                // Mostrar notificación de éxito
                if (typeof window !== 'undefined') {
                    // Opcional: mostrar un toast o notificación
                    console.log('🎉 First email confirmed! Check your new email.');
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Failed to update first email confirmation:', errorText);
            }
        } catch (error) {
            console.error('❌ Error updating first email confirmation:', error);
        }
    };
}