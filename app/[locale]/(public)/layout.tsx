import { LandingFooter, LandingHeader } from "@/features/layout/components";

/**
 * PublicLayout - Shared Layout for Public Routes
 *
 * Provides a consistent layout structure for all public pages including
 * landing page and authentication pages (login, signup, password reset).
 *
 * Features:
 * - Background grid pattern for visual interest
 * - Gradient overlay for reduced brightness and better readability
 * - Responsive header and footer
 * - Flexible main content area that grows to fill available space
 * - Optimized for both full-width content (landing) and centered forms (auth)
 *
 * Visual Design:
 * - Grid pattern with subtle primary color tint
 * - Linear gradient overlay from transparent to background color
 * - Minimum viewport height with flexible overflow handling
 * - Z-index layering: background (0) -> gradient (0) -> header/footer/content (10)
 *
 * Child Pages:
 * - Landing page: Full-width hero sections without container
 * - Auth pages: Centered containers with consistent padding (container mx-auto px-4 py-8 md:py-12)
 * - Each page implements its own container structure for maximum flexibility
 *
 * Route Group: (public)
 * Protected: No authentication required
 * Middleware: Redirects authenticated users from /login and /signup to /dashboard
 *
 * @param children - Page content to render within the layout
 *
 * @example
 * // This layout wraps pages like:
 * // - /[locale] (landing page)
 * // - /[locale]/login
 * // - /[locale]/signup
 * // - /[locale]/reset-password
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-dvh h-[calc(100dvh-8rem)] overflow-y-auto bg-background flex flex-col">

            {/* Background Pattern Layer - Subtle grid pattern with primary color tint */}
            <div className="absolute inset-0 bg-grid-pattern" />

            {/* Gradient Overlay Layer - Reduces brightness for better contrast and readability */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/50 to-background" />

            {/* Header - Fixed at top with navigation and branding */}
            <LandingHeader />

            {/* Main Content Area - Flexible container that grows to fill space */}
            {/* Note: Individual pages implement their own container structure */}
            {/* - Landing page: full-width sections */}
            {/* - Auth pages: centered containers with consistent padding */}
            <main className="relative z-10 grow flex items-center">
                {children}
            </main>

            {/* Footer - Fixed at bottom with links and copyright */}
            <LandingFooter />

        </div>
    );
}
