'use client'

import { useState, useEffect, useRef } from 'react';
import { getEmailChangeStatus } from '@/features/auth/actions/email-change-status';

interface EmailChangeStatus {
    hasEmailChange: boolean;
    oldEmailConfirmed: boolean;
    newEmailConfirmed: boolean;
    newEmail: string | null;
    currentEmail: string;
    loading: boolean;
    processCompleted?: boolean;
    emailConfirmed?: boolean;
    emailConfirmedAt?: string | null;
    confirmedAt?: string | null;
}

export function useEmailChangeStatus() {
    const [status, setStatus] = useState<EmailChangeStatus>({
        hasEmailChange: false,
        oldEmailConfirmed: false,
        newEmailConfirmed: false,
        newEmail: null,
        currentEmail: '',
        loading: true,
        processCompleted: false
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    const checkStatus = async () => {
        try {
            console.log('🔍 useEmailChangeStatus: Checking status...');
            const result = await getEmailChangeStatus();
            
            if (result.success && result.data && mountedRef.current) {
                const newStatus: EmailChangeStatus = {
                    hasEmailChange: result.data.hasEmailChange,
                    oldEmailConfirmed: result.data.oldEmailConfirmed,
                    newEmailConfirmed: result.data.newEmailConfirmed,
                    newEmail: result.data.newEmail,
                    currentEmail: result.data.currentEmail || '',
                    loading: false,
                    processCompleted: result.data.processCompleted || false,
                };
                
                console.log('📊 useEmailChangeStatus: New status:', newStatus);
                console.log('🔍 Should start polling?', {
                    hasEmailChange: newStatus.hasEmailChange,
                    processCompleted: newStatus.processCompleted,
                    loading: newStatus.loading
                });
                
                setStatus(newStatus);
            } else if (mountedRef.current) {
                console.error('❌ useEmailChangeStatus: Error getting status:', result.error);
                setStatus(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            console.error('❌ useEmailChangeStatus: Exception:', error);
            if (mountedRef.current) {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        }
    };

    // Función para limpiar el interval
    const clearPolling = () => {
        if (intervalRef.current) {
            console.log('🛑 useEmailChangeStatus: Clearing interval');
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Función para iniciar el polling
    const startPolling = () => {
        clearPolling(); // Limpiar cualquier interval existente
        console.log('⏰ useEmailChangeStatus: Starting polling every 5 seconds');
        intervalRef.current = setInterval(checkStatus, 5000);
    };

    // Effect inicial - solo para la primera carga
    useEffect(() => {
        console.log('🚀 useEmailChangeStatus: Hook mounted');
        mountedRef.current = true;
        checkStatus();
        
        return () => {
            console.log('🧹 useEmailChangeStatus: Hook unmounting');
            mountedRef.current = false;
            clearPolling();
        };
    }, []);

    // Effect para manejar el polling basado en el estado
    useEffect(() => {
        console.log('🔄 useEmailChangeStatus: Status changed, evaluating polling need...', {
            hasEmailChange: status.hasEmailChange,
            processCompleted: status.processCompleted,
            loading: status.loading,
            oldEmailConfirmed: status.oldEmailConfirmed,
            newEmailConfirmed: status.newEmailConfirmed
        });

        // Limpiar polling existente
        clearPolling();

        // Condiciones para iniciar polling:
        // 1. Hay un cambio de email pendiente
        // 2. El proceso no está completado
        // 3. No estamos en estado de loading
        const shouldPoll = status.hasEmailChange && 
                          !status.processCompleted && 
                          !status.loading;

        console.log('🤔 Should poll?', shouldPoll);

        if (shouldPoll) {
            startPolling();
        } else {
            console.log('⏹️ Not polling because:', {
                noEmailChange: !status.hasEmailChange,
                processCompleted: status.processCompleted,
                loading: status.loading
            });
        }

        // Cleanup cuando el effect se ejecute de nuevo
        return clearPolling;
    }, [status.hasEmailChange, status.processCompleted, status.loading]);

    // Effect adicional para detectar cuando se completa el proceso
    useEffect(() => {
        if (status.hasEmailChange && status.processCompleted) {
            console.log('✅ useEmailChangeStatus: Process completed, stopping polling');
            clearPolling();
        }
    }, [status.hasEmailChange, status.processCompleted]);

    return { 
        status, 
        refreshStatus: checkStatus,
        // Funciones de utilidad para debugging
        startManualPolling: startPolling,
        stopManualPolling: clearPolling
    };
}