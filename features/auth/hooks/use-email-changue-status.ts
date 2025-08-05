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
    processCompleted: boolean;
    requestId?: string;
    expiresAt?: Date;
    oldEmailConfirmedAt?: Date | null;
    newEmailConfirmedAt?: Date | null;
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
    const lastUpdateRef = useRef<string>('');

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
                    requestId: result.data.requestId,
                    expiresAt: result.data.expiresAt ? new Date(result.data.expiresAt) : undefined,
                    oldEmailConfirmedAt: result.data.oldEmailConfirmedAt ? new Date(result.data.oldEmailConfirmedAt) : null,
                    newEmailConfirmedAt: result.data.newEmailConfirmedAt ? new Date(result.data.newEmailConfirmedAt) : null,
                };
                
                // Crear hash para detectar cambios reales
                const statusHash = `${newStatus.hasEmailChange}-${newStatus.oldEmailConfirmed}-${newStatus.newEmailConfirmed}-${newStatus.processCompleted}`;
                
                if (statusHash !== lastUpdateRef.current) {
                    console.log('📊 useEmailChangeStatus: Status changed:', {
                        previous: lastUpdateRef.current,
                        current: statusHash,
                        newStatus
                    });
                    
                    setStatus(newStatus);
                    lastUpdateRef.current = statusHash;
                    
                    // Si el proceso se completó, limpiar polling después de un breve delay
                    if (newStatus.processCompleted && !newStatus.hasEmailChange) {
                        console.log('✅ Process completed, will stop polling in 5 seconds');
                        setTimeout(() => {
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                                intervalRef.current = null;
                                console.log('🛑 Polling stopped due to completion');
                            }
                        }, 5000);
                    }
                } else {
                    console.log('⏸️ No status changes detected');
                    setStatus(prev => ({ ...prev, loading: false }));
                }
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
        console.log('⏰ useEmailChangeStatus: Starting polling every 3 seconds');
        intervalRef.current = setInterval(checkStatus, 3000); // Más frecuente para mejor UX
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
        console.log('🔄 useEmailChangeStatus: Evaluating polling need...', {
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
        // 3. No estamos en estado de loading inicial
        const shouldPoll = status.hasEmailChange && 
                          !status.processCompleted && 
                          !status.loading;

        console.log('🤔 Should poll?', shouldPoll);

        if (shouldPoll) {
            startPolling();
        } else {
            const reasons = [];
            if (!status.hasEmailChange) reasons.push('no email change');
            if (status.processCompleted) reasons.push('process completed');
            if (status.loading) reasons.push('still loading');
            
            console.log('⏹️ Not polling because:', reasons.join(', '));
        }

        return clearPolling;
    }, [status.hasEmailChange, status.processCompleted, status.loading]);

    // Función para obtener el progreso actual
    const getProgress = () => {
        if (!status.hasEmailChange || status.processCompleted) {
            return { step: 'completed', percentage: 100, message: 'Completado' };
        }
        
        if (status.oldEmailConfirmed && status.newEmailConfirmed) {
            return { step: 'completed', percentage: 100, message: 'Completado' };
        }
        
        if (status.oldEmailConfirmed && !status.newEmailConfirmed) {
            return { step: 'step2', percentage: 75, message: 'Confirma tu nuevo email' };
        }
        
        return { step: 'step1', percentage: 25, message: 'Confirma tu email actual' };
    };

    return { 
        status, 
        refreshStatus: checkStatus,
        progress: getProgress(),
        // Funciones de utilidad
        isExpired: status.expiresAt ? new Date() > status.expiresAt : false,
        timeRemaining: status.expiresAt ? Math.max(0, status.expiresAt.getTime() - Date.now()) : 0,
        // Funciones de debugging
        startManualPolling: startPolling,
        stopManualPolling: clearPolling
    };
}