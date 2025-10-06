'use client';

import { useRef, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { HeaderNavProps } from '../types';
import { HeaderNavLink } from './header-nav-link';
import { isAuthRoute } from '@/features/global/utils';

export const HeaderNav = ({ links }: HeaderNavProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const pathname = usePathname();
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  // Check if we're on an auth route (links should be hidden)
  const isAuth = isAuthRoute(pathname);
  
  // Check if we're on the landing page (links should be visible)
  const isLandingPage = pathname === '/' || pathname === '/es' || pathname === '/en';
  
  // Links should be visible if: not an auth route AND on landing page
  const shouldShowLinks = !isAuth && isLandingPage;

  // Initial animation on first load
  useEffect(() => {
    if (!navRef.current || hasAnimatedIn) return;

    const ctx = gsap.context(() => {
      const navItems = navRef.current?.querySelectorAll('.nav-link-item');
      
      if (navItems && navItems.length > 0 && shouldShowLinks) {
        gsap.from(navItems, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.7,
          ease: 'power3.out',
          onComplete: () => setHasAnimatedIn(true),
        });
      } else if (!shouldShowLinks) {
        // If starting on a page where links should be hidden, mark as animated and keep hidden
        setHasAnimatedIn(true);
      }
    }, navRef);

    return () => ctx.revert();
  }, []); // Only run once on mount

  // Animate links based on route changes (after initial animation)
  useEffect(() => {
    if (!navRef.current || !hasAnimatedIn) return; // Only run after initial animation

    const navItems = navRef.current.querySelectorAll('.nav-link-item');
    if (!navItems || navItems.length === 0) return;

    if (shouldShowLinks) {
      // Animate in when links should be visible
      gsap.to(navItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      });
    } else {
      // Animate out when links should be hidden
      gsap.to(navItems, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      });
    }
  }, [shouldShowLinks, hasAnimatedIn]);

  // Intersection Observer to detect active section (only when links are visible)
  useEffect(() => {
    if (!shouldShowLinks) return;

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
  }, [links, shouldShowLinks]);

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
