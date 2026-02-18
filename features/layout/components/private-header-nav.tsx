/**
 * Private Header Navigation (Server Component)
 *
 * Main navigation bar for authenticated users.
 * Composes client components for interactive elements:
 * - DesktopNavLinks: Navigation with active state
 * - LanguageSwitcher: Language selection
 * - ThemeToggle: Theme switching
 * - UserAvatarContainer: User menu with Suspense
 */

import { Store } from 'lucide-react';
import { Suspense } from 'react';

import { DesktopNavLinks } from '@/features/layout/components/desktop-nav-links';
import { LanguageSwitcher } from '@/features/layout/components/language-switcher';
import { ThemeToggle } from '@/features/layout/components/theme-toggle';
import { UserAvatarContainer } from '@/features/layout/components/user-avatar-container';
import { UserAvatarSkeleton } from '@/features/layout/components/user-avatar-skeleton';
import { Link } from '@/i18n/navigation';

export function PrivateHeaderNav() {
  return (
    <nav className="h-16 z-10 relative bg-background/20 backdrop-blur-sm px-2">
      <div className="flex w-full items-center justify-between container mx-auto h-16">
        {/* Logo/Brand */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Lanzate</span>
        </Link>

        {/* Desktop Navigation Links */}
        <DesktopNavLinks />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Suspense fallback={<UserAvatarSkeleton />}>
            <UserAvatarContainer />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
