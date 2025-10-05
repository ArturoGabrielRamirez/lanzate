'use client';

import { useRef, useEffect, useState } from 'react';
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

  // Mouse hover detection at top of screen
  useEffect(() => {
    if (!headerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const triggerZone = 100; // Pixels from top to trigger

      // If mouse is in the trigger zone and header is hidden
      if (e.clientY <= triggerZone && !isHeaderVisible && window.scrollY > 100) {
        setIsHeaderVisible(true);
        if (!isAnimating) {
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
      else if (e.clientY > triggerZone && isHeaderVisible && window.scrollY > 100) {
        setIsHeaderVisible(false);
        if (!isAnimating) {
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHeaderVisible, isAnimating]);

  // Scroll behavior
  useEffect(() => {
    if (!headerRef.current) return;

    const handleScroll = () => {
      if (isAnimating) return;

      const currentScrollY = window.scrollY;
      
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

      // Scrolling down
      if (scrollDifference > 5 && currentScrollY > lastScrollY) {
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
