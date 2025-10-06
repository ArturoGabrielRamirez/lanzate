'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, User as UserIcon, LogOut } from 'lucide-react';
import { MobileDrawerProps } from '../types';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitch } from './language-switch';
import { logoutAction } from '@/features/auth/shared/actions/logout.action';
import { toast } from 'sonner';

export const MobileDrawer = ({ isOpen, onClose, links, user }: MobileDrawerProps) => {
  const t = useTranslations();
  const router = useRouter();
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

          {user ? (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Avatar className="h-10 w-10 border-2 border-primary">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {(user.user_metadata?.full_name || user.email || '').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.user_metadata?.full_name || t('header.userMenu.account')}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* User Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    onClose(false);
                    router.push('/account');
                  }}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  {t('header.userMenu.myAccount')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive"
                  onClick={async () => {
                    const res = await logoutAction();
                    if (res.hasError) {
                      toast.error(t('header.userMenu.logoutError'));
                      return;
                    }
                    toast.success(t('header.userMenu.logoutSuccess'));
                    onClose(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('header.userMenu.logout')}
                </Button>
              </div>
            </>
          ) : (
            <Button className="w-full" size="lg" asChild>
              <Link href="/login" onClick={() => onClose(false)}>
                {t('header.actions.login')}
              </Link>
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
