'use client';

import { Store } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LogoutButton } from '@/features/dashboard/components/logout-button';
import { LanguageSwitcher } from '@/features/layout/components/language-switcher';
import { ThemeToggle } from '@/features/layout/components/theme-toggle';
import { Button } from '@/features/shadcn/components/ui/button';
import { Link, usePathname } from '@/i18n/navigation';

/**
 * PrivateHeader Component
 *
 * Navigation header for authenticated private routes.
 * Includes logo, navigation links, and utility components.
 *
 * Features:
 * - Sticky header with backdrop blur
 * - Logo linking to dashboard
 * - Navigation links: Dashboard, New sale, Stores, Profile
 * - LanguageSwitcher, ThemeToggle, UserAvatar, LogoutButton
 * - Active link highlighting based on current pathname
 * - Responsive design with mobile considerations
 */
export function PrivateHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  const navLinks = [
    { href: '/dashboard', label: t('dashboard'), key: 'dashboard' },
    { href: '/new-sale', label: t('newSale'), key: 'new-sale' },
    { href: '/stores', label: t('stores'), key: 'stores' },
    { href: '/profile', label: t('profile'), key: 'profile' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Lanzate</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.key}
              variant="ghost"
              asChild
              className={
                isActive(link.href)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }
            >
              <Link href={link.href}>
                {link.label}
              </Link>
            </Button>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {/* UserAvatar placeholder */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-semibold text-foreground">U</span>
          </div>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
