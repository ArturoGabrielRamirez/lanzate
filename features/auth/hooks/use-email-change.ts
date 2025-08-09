'use client'

import { useState, useEffect } from 'react';
import { getEmailChangeStatus } from '../actions/index';
import { handleEditEmail } from "../actions";
import { PendingChangeData } from '../types';

export function useEmailChange(currentEmail: string) {
    const [showMonitor, setShowMonitor] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [hasPendingChange, setHasPendingChange] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pendingChangeData, setPendingChangeData] = useState<PendingChangeData>({
        oldEmailConfirmed: false,
        newEmailConfirmed: false,
        newEmail: '',
        processCompleted: false
    });

    // Función para limpiar el estado
    const resetState = () => {
        setHasPendingChange(false);
        setNewEmail('');
        setPendingChangeData({
            oldEmailConfirmed: false,
            newEmailConfirmed: false,
            newEmail: '',
            processCompleted: false
        });
    };

    // Verificar estado inicial y cambios
    const checkPendingChange = async () => {
        if (isLoading) return; // Prevenir llamadas múltiples
        
        setIsLoading(true);
        try {
            const result = await getEmailChangeStatus();

            if (result.success && result.data?.hasEmailChange) {
                const pendingData: PendingChangeData = {
                    oldEmailConfirmed: result.data.oldEmailConfirmed || false,
                    newEmailConfirmed: result.data.newEmailConfirmed || false,
                    newEmail: result.data.newEmail || '',
                    processCompleted: result.data.processCompleted || false
                };

                setHasPendingChange(true);
                setNewEmail(result.data.newEmail || '');
                setPendingChangeData(pendingData);

                if (pendingData.processCompleted) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }

            } else if (result.success) {
                resetState();
            } else if (result.error) {
                console.error('❌ Error checking email status:', result.error);
                resetState();
            }
        } catch (error) {
            console.error('❌ ChangeEmailButton: Error checking pending change:', error);
            resetState();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkPendingChange();
    }, [currentEmail]);

    const changeEmailAction = async (formData: {
        currentPassword: string;
        email: string;
    }) => {
        // Validaciones del lado cliente
        if (formData.email === currentEmail) {
            return {
                error: true,
                message: "El nuevo email debe ser diferente al actual",
                payload: null
            };
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return {
                error: true,
                message: "El formato del email no es válido",
                payload: null
            };
        }

        setIsLoading(true);
        try {
            const result = await handleEditEmail(formData.email);

            if (result.error) {
                return {
                    error: true,
                    message: result.error,
                    payload: null
                };
            }

            const newPendingData: PendingChangeData = {
                oldEmailConfirmed: false,
                newEmailConfirmed: false,
                newEmail: formData.email,
                processCompleted: false
            };

            setNewEmail(formData.email);
            setHasPendingChange(true);
            setPendingChangeData(newPendingData);
            setShowMonitor(true);

            return {
                error: false,
                message: "Proceso iniciado. Revisa ambos emails para confirmar.",
                payload: result.data || null
            };
        } catch (error) {
            console.error('❌ Error in changeEmailAction:', error);
            return {
                error: true,
                message: "Error inesperado al cambiar el email",
                payload: null
            };
        } finally {
            setIsLoading(false);
        }
    };

    const handleMonitorComplete = () => {
        setShowMonitor(false);
        resetState();
    
        setTimeout(() => {
            window.location.reload();
        }, 20000);
    };

    const handleShowMonitor = () => {
        if (hasPendingChange) {
            setShowMonitor(true);
        }
    };

    const getProgressText = () => {
        if (!hasPendingChange) return '';

        if (pendingChangeData.processCompleted ||
            (pendingChangeData.oldEmailConfirmed && pendingChangeData.newEmailConfirmed)) {
            return '✅ Completado';
        } else if (pendingChangeData.oldEmailConfirmed) {
            return '⏳ Paso 2/2';
        } else {
            return '⏳ Paso 1/2';
        }
    };

    const isProcessCompleted = pendingChangeData.processCompleted ||
        (pendingChangeData.oldEmailConfirmed && pendingChangeData.newEmailConfirmed);

    return {
        showMonitor,
        setShowMonitor,
        newEmail,
        hasPendingChange,
        pendingChangeData,
        changeEmailAction,
        handleMonitorComplete,
        handleShowMonitor,
        getProgressText,
        isProcessCompleted,
        isLoading,
        refreshStatus: checkPendingChange
    };
}