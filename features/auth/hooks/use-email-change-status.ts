'use client'

import { useState, useEffect, useRef } from 'react';
import { getEmailChangeStatus } from '../actions/index';

export function useEmailChangeStatus(initialOldEmail: string,
    onComplete: () => void) {
    const [status, setStatus] = useState({
        oldEmailConfirmed: false,
        newEmailConfirmed: false,
        currentEmail: initialOldEmail,
        loading: true,
        hasEmailChange: true,
        processCompleted: false
    });

    const [isManuallyChecking, setIsManuallyChecking] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const hasCompletedRef = useRef(false);
    const isCheckingRef = useRef(false);
    const lastStatusRef = useRef('');

    const checkStatus = async (force = false, isManual = false) => {
        if (isCheckingRef.current && !force) return;
        isCheckingRef.current = true;

        if (isManual) {
            setIsManuallyChecking(true);
        }

        console.log('Checking email change status...');

        try {
            const result = await getEmailChangeStatus();
            console.log('Email change status result:', result);

            if (result.payload && !result.error) {
                const newStatus = {
                    oldEmailConfirmed: result.payload.oldEmailConfirmed || false,
                    newEmailConfirmed: result.payload.newEmailConfirmed || false,
                    currentEmail: result.payload.currentEmail ?? initialOldEmail,
                    loading: false,
                    hasEmailChange: result.payload.hasEmailChange ?? false,
                    processCompleted: result.payload.processCompleted || false
                };

                const statusString = `${newStatus.hasEmailChange}-${newStatus.oldEmailConfirmed}
                -${newStatus.newEmailConfirmed}-${newStatus.processCompleted}`;

                if (statusString !== lastStatusRef.current) {
                    setStatus(newStatus);
                    lastStatusRef.current = statusString;
                } else {
                    setStatus(prev => ({ ...prev, loading: false }));
                }

                if (!newStatus.hasEmailChange || newStatus.processCompleted) {
                    if (!hasCompletedRef.current) {
                        hasCompletedRef.current = true;

                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setTimeout(() => onComplete(), 2000);
                    }
                }
            } else {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        } catch (error) {
            setStatus(prev => ({ ...prev, loading: false }));
        } finally {
            isCheckingRef.current = false;

            if (isManual) {
                setTimeout(() => {
                    setIsManuallyChecking(false);
                }, 800);
            }
        }
    };

    const handleManualCheck = () => {
        checkStatus(true, true);
    };

    useEffect(() => {
        checkStatus(true);
        if (!hasCompletedRef.current) {
            intervalRef.current = setInterval(() => {
                if (!hasCompletedRef.current) {
                    checkStatus();
                }
            }, 3000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [initialOldEmail]);

    useEffect(() => {
        if (!status.hasEmailChange || status.processCompleted) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [status.hasEmailChange, status.processCompleted]);

    return {
        status,
        isManuallyChecking,
        handleManualCheck
    };
}