'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

import { EmailConfirmationDetectorProps } from '@/features/auth/types';

export function useEmailConfirmationDetector({ 
    onFirstEmailConfirmed, 
    onSecondEmailConfirmed 
}: EmailConfirmationDetectorProps = {}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const processedRef = useRef(new Set<string>());

    // Función para limpiar URL memoizada
    const cleanupUrl = useCallback(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            const hasChanges = url.searchParams.has('message') || url.hash;
            
            if (hasChanges) {
                url.searchParams.delete('message');
                url.hash = '';
                window.history.replaceState({}, '', url.toString());
            }
        }
    }, []);

    // Función para manejar la confirmación del primer email
    const handleFirstEmailConfirmation = useCallback(async () => {
        try {
            const response = await fetch('/auth/confirm-first-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString()
                })
            });

            
            if (!response.ok) {
                console.log('Response:', response); 
                console.error('Error al actualizar el estado de confirmación');
                toast.error('Error al actualizar el estado de confirmación');
            }
        } catch (error) {
            console.log('Error:', error);
            console.error('Error de conexión al confirmar email:', error);
            toast.error('Error de conexión al confirmar email');
        }
    }, []);

    useEffect(() => {
        const urlMessage = searchParams?.get('message');
        const hashMessage = typeof window !== 'undefined' ? 
            new URLSearchParams(window.location.hash.substring(1)).get('message') : null;

        const confirmationMessage = urlMessage || hashMessage;

        if (!confirmationMessage) return;

        // Crear un ID único para este mensaje para evitar procesarlo múltiples veces
        const messageId = `${confirmationMessage}-${Date.now()}`;
        
        if (processedRef.current.has(messageId)) {
            return;
        }

        // Marcar como procesado inmediatamente
        processedRef.current.add(messageId);

        // Limpiar mensajes antiguos del Set (mantener solo los últimos 5)
        if (processedRef.current.size > 5) {
            const array = Array.from(processedRef.current);
            processedRef.current = new Set(array.slice(-3));
        }

        // Procesar confirmación del primer email
        if (confirmationMessage.includes('Confirmation link accepted') && 
            confirmationMessage.includes('Please proceed to confirm link sent to the other email')) {
            
            console.log('📧 First email confirmation detected');
            
            onFirstEmailConfirmed?.();
            handleFirstEmailConfirmation();
            cleanupUrl();
            
            toast.success('Email actual confirmado. Revisa tu nuevo email para completar el cambio.');
            
            // Usar setTimeout para evitar conflictos con el estado
            setTimeout(() => {
                router.push('/account?emailStep=1');
            }, 1500);
        }
        // Procesar confirmación del segundo email
        else if (confirmationMessage.includes('Email updated successfully') || 
                 confirmationMessage.includes('Email confirmed successfully')) {
            
            console.log('📧 Second email confirmation detected');
            
            onSecondEmailConfirmed?.();
            cleanupUrl();
            
            toast.success('¡Email actualizado exitosamente!');
            
            setTimeout(() => {
                router.push('/account?emailStep=2');
            }, 1500);
        }
    }, [searchParams, onFirstEmailConfirmed, onSecondEmailConfirmed, router, handleFirstEmailConfirmation, cleanupUrl]);

    // Cleanup effect para prevenir memory leaks
    useEffect(() => {
        return () => {
            processedRef.current.clear();
        };
    }, []);
}