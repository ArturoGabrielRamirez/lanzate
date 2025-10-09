'use client';

import { gsap } from 'gsap';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { HEADER_CONSTANTS } from '@/features/header/constants/header.constants';

export const useHeaderVisibility = (headerRef: MutableRefObject<HTMLElement | null>) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mouseYRef = useRef<number>(0);

  // Mouse position tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseYRef.current = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mouse hover detection at top of screen
  useEffect(() => {
    if (!headerRef.current) return;

    const checkMousePosition = () => {
      const triggerZone = HEADER_CONSTANTS.SCROLL_TRIGGER_ZONE;
      const currentMouseY = mouseYRef.current;

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
      } else if (currentMouseY > triggerZone && isHeaderVisible && window.scrollY > 100) {
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
    return () => clearInterval(intervalId);
  }, [isHeaderVisible, isAnimating, headerRef]);

  // Scroll behavior
  useEffect(() => {
    if (!headerRef.current) return;

    const handleScroll = () => {
      if (isAnimating) return;
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        if (headerRef.current) {
          gsap.to(headerRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
        }
        setIsHeaderVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      const scrollDifference = currentScrollY - lastScrollY;
      const triggerZone = HEADER_CONSTANTS.SCROLL_TRIGGER_ZONE;

      if (scrollDifference > HEADER_CONSTANTS.SCROLL_THRESHOLD && currentScrollY > lastScrollY) {
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
      } else if (scrollDifference < -HEADER_CONSTANTS.SCROLL_THRESHOLD && currentScrollY < lastScrollY) {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isAnimating, headerRef]);

  return { isHeaderVisible };
};


