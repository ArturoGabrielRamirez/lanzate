'use client'

import { useState, useEffect, useCallback } from 'react'

import { getEmailChangeStatusAction } from '@/features/auth/actions'
import { handleEditEmailAction } from "@/features/auth/actions"
import { PendingChangeData } from '@/features/auth/types'

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

    const checkPendingChange = useCallback(async () => {

        if (isLoading) return;

        setIsLoading(true);
        try {
            const { payload: result, hasError, message } = await getEmailChangeStatusAction();

            if (result?.success && result.hasEmailChange) {
                const pendingData: PendingChangeData = {
                    oldEmailConfirmed: result.oldEmailConfirmed || false,
                    newEmailConfirmed: result.newEmailConfirmed || false,
                    newEmail: result.newEmail || '',
                    processCompleted: result.processCompleted || false
                };

                setHasPendingChange(true);
                setNewEmail(result.newEmail || '');
                setPendingChangeData(pendingData);

                if (pendingData.processCompleted) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }

            } else if (result?.success) {
                resetState();
            } else if (hasError) {
                console.error('❌ Error al obtener el estado del cambio de email:', message);
                resetState();
            }
        } catch (hasError) {
            console.error('❌ ChangeEmailButton: Error checking pending change:', hasError);
            resetState();
        } finally {
            setIsLoading(false);
        }
    }, [isLoading])

    useEffect(() => {
        checkPendingChange();
    }, [currentEmail, checkPendingChange]);

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
            const result = await handleEditEmailAction({ email: formData.email, password: formData.currentPassword }) /* as { error: boolean | string, message?: string, data?: any } */;

            console.log('🔍 Result from handleEditEmail:', result); // Para debug

            // Manejo consistente de errores
            if (result.hasError) {
                // Resetear estado en caso de error para evitar que se "atasque"
                resetState();

                return {
                    error: true,
                    message: typeof result.hasError === 'string'
                        ? result.hasError
                        : result.message || "Ocurrió un error",
                    payload: null
                };
            }

            // Si llegamos aquí, fue exitoso
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
                message: result.message || "Proceso iniciado. Revisa ambos emails para confirmar.",
                payload: result || formData
            };

        } catch (error) {
            console.error('❌ Error in changeEmailAction:', error);

            // Resetear estado en caso de excepción
            resetState();

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
