import { useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export function useAccountDeletion(onAccountDeleted?: () => void) {
    const [isDeleted, setIsDeleted] = useState(false);
    const [isCheckingDeletion, setIsCheckingDeletion] = useState(false);
    const supabase = createClient();

    const clearAuthCookies = useCallback(async () => {
        try {
            const cookies = [
                'supabase-auth-token',
                'sb-access-token',
                'sb-refresh-token',
                'supabase.auth.token'
            ];

            cookies.forEach(cookieName => {
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            });

            localStorage.clear();
            sessionStorage.clear();

            if (supabase) {
                await supabase.auth.signOut();
            }
        } catch (error) {
            console.error('Error limpiando cookies:', error);
        }
    }, [supabase]);

    const handleAccountDeletion = useCallback(async () => {
        try {
            await clearAuthCookies();
            onAccountDeleted?.();

            setTimeout(() => {
                window.location.href = '/login?message=account_deleted';
            }, 3000);
        } catch (error) {
            console.error('Error durante limpieza post-eliminación:', error);
            window.location.href = '/login?message=account_deleted';
        }
    }, [clearAuthCookies, onAccountDeleted]);

    const checkAccountStatus = useCallback(async () => {
        if (isCheckingDeletion) return;

        setIsCheckingDeletion(true);
        try {
            const response = await fetch('/api/user/deletion-status');

            if (response.status === 404 || response.status === 401) {
                setIsDeleted(true);
                await handleAccountDeletion();
                return;
            }

            if (response.ok) {
                const status = await response.json();
                if (!status.isDeletionRequested) {
                    const userCheckResponse = await fetch('/api/auth/check-user');
                    if (userCheckResponse.status === 404) {
                        setIsDeleted(true);
                        await handleAccountDeletion();
                    }
                }
            }
        } catch (error) {
            console.error('Error verificando estado de cuenta:', error);
            setIsDeleted(true);
            await handleAccountDeletion();
        } finally {
            setIsCheckingDeletion(false);
        }
    }, [isCheckingDeletion, handleAccountDeletion]);

    return {
        isDeleted,
        isCheckingDeletion,
        checkAccountStatus,
        handleAccountDeletion
    };
}