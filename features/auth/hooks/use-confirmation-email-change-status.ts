'use client'

import { useState, useEffect, useRef } from 'react';
import { getEmailChangeStatus } from '@/features/auth/actions/email-change-status';
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

                const statusHash = `${newStatus.hasEmailChange}-${newStatus.oldEmailConfirmed}-${newStatus.newEmailConfirmed}-${newStatus.processCompleted}`;

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