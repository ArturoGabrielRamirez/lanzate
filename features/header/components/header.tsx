'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { HeaderProps } from '../types';
import { NAV_LINKS } from '../constants';
import { HeaderLogo } from './header-logo';
import { HeaderNav } from './header-nav';
import { HeaderActions } from './header-actions';
import { MobileHeader } from './mobile-header';

export const Header = ({ className }: HeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

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

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className || ''
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-20 items-center justify-between">
          {/* Logo */}
          <div ref={logoRef}>
            <HeaderLogo />
          </div>

          {/* Desktop Navigation */}
          <HeaderNav links={NAV_LINKS} />

          {/* Desktop Actions */}
          <HeaderActions />

          {/* Mobile Menu Button */}
          <MobileHeader links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
};
