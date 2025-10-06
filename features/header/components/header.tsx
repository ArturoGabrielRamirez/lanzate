'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { HeaderProps } from '../types';
import { getNavLinks, getNavMenuItemsAuth, getNavMenuItemsGuest } from '../constants';
import { isAuthenticated } from '@/features/global/utils';
import { HeaderLogo } from './header-logo';
import { HeaderNav } from './header-nav';
import { HeaderActions } from './header-actions';
import { MobileHeader } from './mobile-header';

export const Header = ({ className, user }: HeaderProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const NAV_LINKS = getNavLinks(t);
  const NAV_MENU_ITEMS = isAuthenticated(user) 
    ? getNavMenuItemsAuth(t, locale)
    : getNavMenuItemsGuest(t, locale);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mouseYRef = useRef<number>(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

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

  // Mouse position tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseYRef.current = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Mouse hover detection at top of screen
  useEffect(() => {
    if (!headerRef.current) return;

    const checkMousePosition = () => {
      const triggerZone = 100;
      const currentMouseY = mouseYRef.current;

      // If mouse is in the trigger zone and header is hidden
      if (currentMouseY <= triggerZone && !isHeaderVisible && window.scrollY > 100) {
        setIsHeaderVisible(true);
        if (!isAnimating && headerRef.current) {
          setIsAnimating(true);
          gsap.to(headerRef.current, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => setIsAnimating(false),
          });
        }
      }
      // If mouse leaves the trigger zone and header is visible and we're scrolled down
      else if (currentMouseY > triggerZone && isHeaderVisible && window.scrollY > 100) {
        setIsHeaderVisible(false);
        if (!isAnimating && headerRef.current) {
          setIsAnimating(true);
          gsap.to(headerRef.current, {
            y: -100,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => setIsAnimating(false),
          });
        }
      }
    };

    const intervalId = setInterval(checkMousePosition, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [isHeaderVisible, isAnimating]);

  // Scroll behavior
  useEffect(() => {
    if (!headerRef.current) return;

    const handleScroll = () => {
      if (isAnimating) return;

      const currentScrollY = window.scrollY;
      const triggerZone = 100;
      
      // Only trigger after scrolling past 100px
      if (currentScrollY < 100) {
        if (headerRef.current) {
          gsap.to(headerRef.current, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
        setIsHeaderVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      const scrollDifference = currentScrollY - lastScrollY;

      // Scrolling down - but don't hide if mouse is in trigger zone
      if (scrollDifference > 5 && currentScrollY > lastScrollY) {
        // Don't hide header if mouse is in the trigger zone
        if (mouseYRef.current <= triggerZone) {
          setLastScrollY(currentScrollY);
          return;
        }
        
        setIsAnimating(true);
        setIsHeaderVisible(false);
        gsap.to(headerRef.current, {
          y: -100,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => setIsAnimating(false),
        });
      }
      // Scrolling up
      else if (scrollDifference < -5 && currentScrollY < lastScrollY) {
        setIsAnimating(true);
        setIsHeaderVisible(true);
        gsap.to(headerRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => setIsAnimating(false),
        });
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isAnimating]);

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
          <HeaderNav menuItems={NAV_MENU_ITEMS} />

          {/* Desktop Actions */}
          <HeaderActions user={user} />

          {/* Mobile Menu Button */}
          <MobileHeader links={NAV_LINKS} user={user} />
        </div>
      </div>
    </header>
  );
};
