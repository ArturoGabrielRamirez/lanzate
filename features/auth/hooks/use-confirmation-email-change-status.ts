'use client'

import { useState, useEffect, useRef } from 'react';
import { getEmailChangeStatus } from '../actions/index';
import { EmailChangeStatus } from '../types';

export function useConfirmationEmailChangeStatus() {
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
            const result = await getEmailChangeStatus();
            console.log('Email change status en useConfirmationEmailChangeStatus:', result);

            if (result.payload.success && result.payload && mountedRef.current) {
                const newStatus: EmailChangeStatus = {
                    hasEmailChange: result.payload?.hasEmailChange,
                    oldEmailConfirmed: result.payload?.oldEmailConfirmed,
                    newEmailConfirmed: result.payload?.newEmailConfirmed,
                    newEmail: result.payload?.newEmail,
                    currentEmail: result.payload?.currentEmail || '',
                    loading: false,
                    processCompleted: result.payload?.processCompleted || false,
                    requestId: result.payload?.requestId,
                    expiresAt: result.payload?.expiresAt ? new Date(result.payload.expiresAt) : undefined,
                    oldEmailConfirmedAt: result.payload?.oldEmailConfirmedAt ?
                     new Date(result.payload.oldEmailConfirmedAt) : null,
                    newEmailConfirmedAt: result.payload?.newEmailConfirmedAt ?
                     new Date(result.payload.newEmailConfirmedAt) : null,
                };

                const statusHash = `${newStatus.hasEmailChange}-${newStatus.oldEmailConfirmed}
                -${newStatus.newEmailConfirmed}-${newStatus.processCompleted}`;

                if (statusHash !== lastUpdateRef.current) {
                    setStatus(newStatus);
                    lastUpdateRef.current = statusHash;

                    if (newStatus.processCompleted && !newStatus.hasEmailChange) {
                        clearPolling();
                    }
                } else {
                    setStatus(prev => ({ ...prev, loading: false }));
                }
            } else if (mountedRef.current) {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            if (mountedRef.current) {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        }
    };

    const clearPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startPolling = () => {
        clearPolling();
        intervalRef.current = setInterval(checkStatus, 3000);
    };

    useEffect(() => {
        mountedRef.current = true;
        checkStatus();

        return () => {
            mountedRef.current = false;
            clearPolling();
        };
    }, []);

    useEffect(() => {
        clearPolling();

        const shouldPoll = status.hasEmailChange &&
            !status.processCompleted &&
            !status.loading;

        if (shouldPoll) {
            startPolling();
        }

        return clearPolling;
    }, [status.hasEmailChange, status.processCompleted, status.loading]);

    console.log('Email change status:', status);

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
        isExpired: status.expiresAt ? new Date() > status.expiresAt : false,
        timeRemaining: status.expiresAt ? Math.max(0, status.expiresAt.getTime() - Date.now()) : 0,
    };
}