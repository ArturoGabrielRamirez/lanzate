'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRef } from 'react';

import { useGsapFadeIn } from '@/features/global/hooks';
import { HeaderActions } from '@/features/header/components/header-actions';
import { HeaderLogo } from '@/features/header/components/header-logo';
import { HeaderNav } from '@/features/header/components/header-nav';
import { MobileHeader } from '@/features/header/components/mobile-header';
import { getNavLinks, getNavMenuItemsGuest } from '@/features/header/constants';
import type { HeaderProps } from '@/features/header/types';

export const Header = ({ className, user }: HeaderProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const NAV_LINKS = getNavLinks(t);
  const NAV_MENU_ITEMS = getNavMenuItemsGuest(t, locale);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Initial entrance animation
  useGsapFadeIn(headerRef, { y: -100, opacity: 0, duration: 0.6 });
  useGsapFadeIn(logoRef, { x: -20, opacity: 0, delay: 0.3 });

  // Visibility logic moved to hook if needed in future iterations

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className || ''
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-20 items-center justify-between">
          {/* Logo */}
          <div ref={logoRef}>
            <HeaderLogo />
          </div>

          {/* Desktop Navigation */}
          <HeaderNav menuItems={NAV_MENU_ITEMS} user={user || null} />

          {/* Desktop Actions */}
          <HeaderActions user={user || null} />

          {/* Mobile Menu Button */}
          <MobileHeader links={NAV_LINKS} user={user || null} />
        </div>
      </div>
    </header>
  );
};
