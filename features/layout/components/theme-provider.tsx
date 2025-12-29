'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Theme Provider Component
 *
 * Wraps the next-themes ThemeProvider to provide theme switching functionality
 * across the application. Configured with dark mode as default to match the
 * landing page design.
 *
 * Features:
 * - Dark mode as default theme
 * - System theme detection enabled
 * - Class-based theme attribute for Tailwind CSS
 * - Prevents hydration mismatch with suppressHydrationWarning
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
