'use client';

import { useRef, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { HeaderNavProps } from '../types';
import { HeaderNavLink } from './header-nav-link';

export const HeaderNav = ({ links }: HeaderNavProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const pathname = usePathname();
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  // Check if we're on the landing page
  const isLandingPage = pathname === '/' || pathname === '/es' || pathname === '/en';

  // Initial animation
  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      const navItems = navRef.current?.querySelectorAll('.nav-link-item');
      
      if (navItems && navItems.length > 0 && isLandingPage && !hasAnimatedIn) {
        gsap.from(navItems, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.7,
          ease: 'power3.out',
          onComplete: () => setHasAnimatedIn(true),
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, [isLandingPage, hasAnimatedIn]);

  // Animate links based on route
  useEffect(() => {
    if (!navRef.current) return;

    const navItems = navRef.current.querySelectorAll('.nav-link-item');
    if (!navItems || navItems.length === 0) return;

    if (isLandingPage) {
      // Animate in when returning to landing
      gsap.to(navItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      });
    } else {
      // Animate out when leaving landing
      gsap.to(navItems, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      });
    }
  }, [isLandingPage]);

  // Intersection Observer to detect active section (only on landing page)
  useEffect(() => {
    if (!isLandingPage) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    links.forEach((link) => {
      const sectionId = link.href.split('#')[1];
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [links, isLandingPage]);

  return (
    <nav ref={navRef} className="hidden md:flex items-center gap-1">
      {links.map((link) => {
        const sectionId = link.href.split('#')[1];
        const isActive = activeSection === sectionId;

        return (
          <div key={link.href} className="nav-link-item">
            <HeaderNavLink
              label={link.label}
              href={link.href}
              isActive={isActive}
            />
          </div>
        );
      })}
    </nav>
  );
};
