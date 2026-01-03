"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

/**
 * Toaster component for displaying toast notifications
 *
 * A wrapper around Sonner that integrates with the theme system and
 * provides consistent styling for toast notifications across the application.
 *
 * @example
 * ```tsx
 * // Add to your root layout
 * import { Toaster } from '@/features/shadcn/components/ui/toaster';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <Toaster />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
