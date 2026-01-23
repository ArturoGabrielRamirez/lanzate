'use client';

/**
 * Private Header Navigation (Client Component)
 *
 * Contains all the interactive/client-side parts of the header:
 * - Navigation links with active state
 * - Language switcher
 * - Theme toggle
 * - User avatar
 * - Logout button
 */

import { Store } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LogoutButton } from '@/features/dashboard/components/logout-button';
import { LanguageSwitcher } from '@/features/layout/components/language-switcher';
import { ThemeToggle } from '@/features/layout/components/theme-toggle';
import { Button } from '@/features/shadcn/components/ui/button';
import { Link, usePathname } from '@/i18n/navigation';

export function PrivateHeaderNav() {
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
    <nav className="h-16 z-10 relative bg-background/80 backdrop-blur-sm ">
      <div className="flex w-full items-center justify-between container mx-auto h-16 ">
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
      </div>
    </nav>
  );
}
