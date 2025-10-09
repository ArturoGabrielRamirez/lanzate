'use client';

import { gsap } from 'gsap';
import { useRef, useEffect, useState } from 'react';

import { HeaderNavAuth } from '@/features/header/components/header-nav-auth';
import { HeaderNavGuest } from '@/features/header/components/header-nav-guest';
import type { HeaderNavProps } from '@/features/header/types';

export const HeaderNav = ({ menuItems, user }: HeaderNavProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const isUserAuthenticated = Boolean(user);

  // Initial animation on first load
  useEffect(() => {
    if (!navRef.current || hasAnimatedIn) return;

    const ctx = gsap.context(() => {
      const navWrapper = navRef.current;

      if (navWrapper) {
        gsap.from(navWrapper, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          delay: 0.7,
          ease: 'power3.out',
          onComplete: () => setHasAnimatedIn(true),
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, [hasAnimatedIn]); // Only run once on mount

  // Auth vs Guest rendering
  return isUserAuthenticated ? (
    <HeaderNavAuth user={user} />
  ) : (
    <HeaderNavGuest menuItems={menuItems} />
  );
};
