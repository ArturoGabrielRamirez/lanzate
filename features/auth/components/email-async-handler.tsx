
'use client';

import { useEffect } from 'react';
import { syncEmailAfterConfirmation } from './index'

export default function EmailSyncHandler() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('emailCompleted') === 'true') {
            // Sincronizar email después de la confirmación
            syncEmailAfterConfirmation().then((result) => {
                if (result.success) {
                    // Limpiar la URL y recargar
                    window.history.replaceState({}, '', '/account');
                    window.location.reload();
                }
            });
        }
    }, []);

    return null; // No renderiza nada
}