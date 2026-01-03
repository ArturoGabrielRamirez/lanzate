'use client';

import { Store } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogoutButton } from '@/features/dashboard/components/logout-button';
import { LanguageSwitcher } from '@/features/layout/components/language-switcher';
import { ThemeToggle } from '@/features/layout/components/theme-toggle';

/**
 * Dashboard Navigation Component
 *
 * Top navigation bar for the dashboard with:
 * - Lanzate logo/brand
 * - Navigation links (Dashboard, New sale, Stores, Account)
 * - Language switcher
 * - Theme toggle
 * - Logout button
 * - Responsive design
 *
 * Matches the design from general-dashboard-after-login.png
 */
export function DashboardNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 container items-center justify-between px-6 md:px-12 lg:px-16">
        {/* Logo/Brand */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Lanzate</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/dashboard"
            className={`relative text-sm font-medium transition-colors hover:text-primary ${
              isActive('/dashboard')
                ? 'text-primary after:absolute after:-bottom-5 after:left-0 after:h-0.5 after:w-full after:bg-primary'
                : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/new-sale"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/new-sale') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            New sale
          </Link>
          <Link
            href="/stores"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/stores') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Stores
          </Link>
          <Link
            href="/account"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/account') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Account
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-semibold text-foreground">U</span>
          </div>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
