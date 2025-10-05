'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerOverlay,
} from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { MobileDrawerProps } from '../types';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitch } from './language-switch';

export const MobileDrawer = ({ isOpen, onClose, links }: MobileDrawerProps) => {
  const t = useTranslations();
  const [activeSection, setActiveSection] = useState<string>('');

  // Intersection Observer to detect active section
  useEffect(() => {
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
  }, [links]);

  const handleLinkClick = (href: string) => {
    onClose(false);
    
    const targetId = href.split('#')[1];
    const element = document.getElementById(targetId);
    
    if (element) {
      setTimeout(() => {
        const headerOffset = 56;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 300);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} setBackgroundColorOnScale>
      {/* <DrawerOverlay className='backdrop-blur-sm' /> */}
      <DrawerContent className="md:hidden !w-[calc(100%-2rem)] mx-auto">
        {/* Header */}
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle>{t('header.mobile.menu')}</DrawerTitle>
          <DrawerClose asChild>
            <button
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label={t('header.mobile.closeMenu')}
            >
              <X className="w-5 h-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Navigation Links */}
        <nav className="flex flex-col p-4 gap-2 flex-1">
          {links.map((link) => {
            const sectionId = link.href.split('#')[1];
            const isActive = activeSection === sectionId;
            
            return (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <DrawerFooter className="space-y-3">
          {/* Settings Toolbar */}
          <div className="flex items-center justify-center gap-4 p-3 rounded-lg bg-muted/50">
            <LanguageSwitch />
            <div className="h-6 w-px bg-border" />
            <ThemeToggle />
          </div>

          {/* Login Button */}
          <Button className="w-full" size="lg" asChild>
            <Link href="/login" onClick={() => onClose(false)}>
              {t('header.actions.login')}
            </Link>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
