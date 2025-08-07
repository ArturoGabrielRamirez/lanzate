'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function EmailSyncHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        const emailCompleted = searchParams?.get('emailCompleted');
        const emailStep = searchParams?.get('emailStep');

        if (emailCompleted === 'true' || emailStep) {
            processedRef.current = true;
            
            // Limpiar parámetros de la URL
            const url = new URL(window.location.href);
            url.searchParams.delete('emailCompleted');
            url.searchParams.delete('emailStep');
            
            // Limpiar también el hash si existe
            if (url.hash) {
                const hashParams = new URLSearchParams(url.hash.substring(1));
                if (hashParams.has('message')) {
                    url.hash = '';
                }
            }

            window.history.replaceState({}, '', url.toString());

            // Mostrar mensaje apropiado según el paso
            if (emailStep === '1') {
                toast.success('Primer email confirmado', {
                    description: 'Ahora revisa tu nuevo email para completar el cambio.',
                    duration: 5000
                });
            } else if (emailStep === '2') {
                toast.success('¡Email actualizado exitosamente!', {
                    description: 'El cambio de email se ha completado.',
                    duration: 5000
                });
            } else if (emailCompleted === 'true') {
                toast.info('Verificando estado del email...', {
                    description: 'La página se actualizará automáticamente.',
                    duration: 3000
                });
            }

            // Recargar después de un breve delay para permitir que se procesen los cambios
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }, [searchParams, router]);

    return null; // No renderiza nada
}


/* 
'use client';

import { useEffect } from 'react';
import { syncEmailAfterConfirmation } from './index'

export default function EmailSyncHandler() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('emailCompleted') === 'true') {
        
            syncEmailAfterConfirmation().then((result) => {
                if (result.success) {
          
                    window.history.replaceState({}, '', '/account');
                    window.location.reload();
                }
            });
        }
    }, []);

    return null; 
} */