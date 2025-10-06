'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { HeaderProps } from '../types';
import { getNavLinks, getNavMenuItemsGuest } from '../constants';
import { HeaderLogo } from './header-logo';
import { HeaderNav } from './header-nav';
import { HeaderActions } from './header-actions';
import { MobileHeader } from './mobile-header';

export const Header = ({ className, user }: HeaderProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const NAV_LINKS = getNavLinks(t);
  const NAV_MENU_ITEMS = getNavMenuItemsGuest(t, locale);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Initial entrance animation
  useEffect(() => {
    if (!headerRef.current || !logoRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.6,
      })
      .from(logoRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.5,
      }, '-=0.3');
    }, headerRef);

    return () => ctx.revert();
  }, []);

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
          <HeaderNav menuItems={NAV_MENU_ITEMS} user={user} locale={locale} />

          {/* Desktop Actions */}
          <HeaderActions user={user} />

          {/* Mobile Menu Button */}
          <MobileHeader links={NAV_LINKS} user={user} />
        </div>
      </div>
    </header>
  );
};
