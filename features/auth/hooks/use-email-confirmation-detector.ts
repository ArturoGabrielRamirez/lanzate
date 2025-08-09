'use client'

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EmailConfirmationDetectorProps } from '../types';

export function useEmailConfirmationDetector({ 
    onFirstEmailConfirmed, 
    onSecondEmailConfirmed 
}: EmailConfirmationDetectorProps = {}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        const cleanupUrl = () => {
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('message');
                url.hash = '';
                window.history.replaceState({}, '', url.toString());
            }
        };

        const urlMessage = searchParams?.get('message');
        const hashMessage = typeof window !== 'undefined' ? 
            new URLSearchParams(window.location.hash.substring(1)).get('message') : null;

        const confirmationMessage = urlMessage || hashMessage;

        if (confirmationMessage) {
            if (confirmationMessage.includes('Confirmation link accepted') && 
                confirmationMessage.includes('Please proceed to confirm link sent to the other email')) {
                
                processedRef.current = true;
                
                onFirstEmailConfirmed?.();
                handleFirstEmailConfirmation();
                cleanupUrl();
                
                toast.success('Email actual confirmado. Revisa tu nuevo email para completar el cambio.');
                
                setTimeout(() => {
                    router.push('/account?emailStep=1');
                }, 1000);
            }

            else if (confirmationMessage.includes('Email updated successfully') || 
                     confirmationMessage.includes('Email confirmed successfully')) {
                
                processedRef.current = true;
                
                onSecondEmailConfirmed?.();
                cleanupUrl();
                
                toast.success('¡Email actualizado exitosamente!');
                
                setTimeout(() => {
                    router.push('/account?emailStep=2');
                }, 1000);
            }
        }
    }, [searchParams, onFirstEmailConfirmed, onSecondEmailConfirmed, router]);

    const handleFirstEmailConfirmation = async () => {
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
                toast.error('Error al actualizar el estado de confirmación');
            }
        } catch (error) {
            toast.error('Error de conexión al confirmar email');
        }
    };
}