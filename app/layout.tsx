/**
 * Root layout - redirects to locale-specific layout.
 *
 * This file exists only to satisfy Next.js App Router requirements.
 * The actual layout logic is in app/[locale]/layout.tsx.
 *
 * The middleware (proxy.ts) will handle redirecting users to the
 * appropriate locale-specific route (e.g., /es or /en).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
