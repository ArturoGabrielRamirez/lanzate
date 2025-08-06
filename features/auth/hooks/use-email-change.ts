'use client'

import { useState, useEffect } from 'react';
import { getEmailChangeStatus } from '@/features/auth/actions/email-change-status';
import { handleEditEmail } from "@/features/auth/actions/handle-edit-email";
import { PendingChangeData } from '../types';

export function useEmailChange(currentEmail: string) {
    const [showMonitor, setShowMonitor] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [hasPendingChange, setHasPendingChange] = useState(false);
    const [pendingChangeData, setPendingChangeData] = useState<PendingChangeData>({
        oldEmailConfirmed: false,
        newEmailConfirmed: false,
        newEmail: '',
        processCompleted: false
    });

    useEffect(() => {
        const checkPendingChange = async () => {
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

                } else if (result.success) {
                    setHasPendingChange(false);
                    setPendingChangeData({
                        oldEmailConfirmed: false,
                        newEmailConfirmed: false,
                        newEmail: '',
                        processCompleted: false
                    });
                }
            } catch (error) {
                console.error('❌ ChangeEmailButton: Error checking pending change:', error);
            }
        };

        checkPendingChange();
    }, []);

    const changeEmailAction = async (formData: {
        currentPassword: string;
        email: string;
    }) => {
        if (formData.email === currentEmail) {
            return {
                error: true,
                message: "El nuevo email debe ser diferente al actual",
                payload: null
            };
        }

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
            return {
                error: true,
                message: "Error inesperado al cambiar el email",
                payload: null
            };
        }
    };

    const handleMonitorComplete = () => {
        setShowMonitor(false);
        setHasPendingChange(false);
        setNewEmail('');
        setPendingChangeData({
            oldEmailConfirmed: false,
            newEmailConfirmed: false,
            newEmail: '',
            processCompleted: false
        });

        setTimeout(() => {
            window.location.reload();
        }, 500);
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
        isProcessCompleted
    };
}