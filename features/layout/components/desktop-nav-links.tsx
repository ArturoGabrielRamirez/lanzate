'use client';

/**
 * Desktop Navigation Links Component (Client Component)
 *
 * Navigation links with active state detection.
 * Uses usePathname and useTranslations hooks for
 * routing awareness and internationalization.
 */

import { useTranslations } from 'next-intl';

import { Button } from '@/features/shadcn/components/ui/button';
import { cn } from '@/features/shadcn/utils/cn';
import { Link, usePathname } from '@/i18n/navigation';

import type { DesktopNavLinksProps } from '@/features/layout/types';

export function DesktopNavLinks({ className }: DesktopNavLinksProps) {
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
    <div className={cn('hidden items-center gap-1 md:flex', className)}>
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
  );
}
