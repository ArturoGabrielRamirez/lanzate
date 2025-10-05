'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { HeaderNavProps } from '../types';
import { HeaderNavLink } from './header-nav-link';

export const HeaderNav = ({ links }: HeaderNavProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  // Initial animation
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
          delay: 0.7,
          ease: 'power3.out',
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Intersection Observer to detect active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle of viewport
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
  }, [links]);

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
