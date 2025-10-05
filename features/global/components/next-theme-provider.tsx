'use client';

import { ThemeProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

export const NextThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
    return <ThemeProvider {...props}>{children}</ThemeProvider>;
};
