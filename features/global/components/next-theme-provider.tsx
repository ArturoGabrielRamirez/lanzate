'use client';

import { ThemeProvider } from 'next-themes';

import type { ThemeProviderProps } from 'next-themes';

function NextThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
export { NextThemeProvider };