'use client';

/**
 * Storefront Context
 *
 * Provides store public data (store, theme, homeSections) to any client
 * component within the storefront without prop drilling.
 *
 * The provider lives in the server-rendered layout.tsx and passes the
 * already-fetched data down. Client components use `useStorefront()`.
 */

import { createContext, useContext } from 'react';

import type { StorePublicData } from '@/features/stores/types';

const StorefrontContext = createContext<StorePublicData | null>(null);

interface StorefrontContextProviderProps {
    value: StorePublicData;
    children: React.ReactNode;
}

export function StorefrontContextProvider({ value, children }: StorefrontContextProviderProps) {
    return (
        <StorefrontContext.Provider value={value}>
            {children}
        </StorefrontContext.Provider>
    );
}

export function useStorefront(): StorePublicData {
    const ctx = useContext(StorefrontContext);
    if (!ctx) {
        throw new Error('useStorefront must be used within StorefrontContextProvider');
    }
    return ctx;
}
