'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { HeaderNavProps } from '../types';
import { HeaderNavLink } from './header-nav-link';

export const HeaderNav = ({ links }: HeaderNavProps) => {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      const navItems = navRef.current?.querySelectorAll('.nav-link-item');
      
      if (navItems && navItems.length > 0) {
        gsap.from(navItems, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="hidden md:flex items-center gap-1">
      {links.map((link) => (
        <div key={link.href} className="nav-link-item">
          <HeaderNavLink
            label={link.label}
            href={link.href}
          />
        </div>
      ))}
    </nav>
  );
};
