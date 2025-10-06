'use client';

import { useRef, useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { HeaderNavProps } from '../types';
import { isAuthenticated } from '@/features/global/utils';
import { useTranslations } from 'next-intl';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { googleSignInAction } from '@/features/auth/login/actions/google-sign-in.action';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const HeaderNav = ({ menuItems, user }: HeaderNavProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const isUserAuthenticated = isAuthenticated(user);

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
  }, []); // Only run once on mount

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      e.preventDefault();
      const targetId = href.split('#')[1];
      const element = document.getElementById(targetId);

      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleGoogleAuth = async () => {
    const res = await googleSignInAction();
    if (res.hasError || !res.payload?.url) return;
    router.push(res.payload.url);
  };

  // If user is authenticated, show simple nav links
  if (isUserAuthenticated) {
    const navLinks = [
      { label: t('header.nav.user.dashboard'), href: '/dashboard' },
      { label: t('header.nav.user.newSale'), href: '/new-sale' },
      { label: t('header.nav.user.stores'), href: '/stores' },
      { label: t('header.nav.user.account'), href: '/account' },
    ];

    return (
      <nav ref={navRef} className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = pathname.includes(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-2 text-sm font-medium transition-colors group ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
              />
            </Link>
          );
        })}
      </nav>
    );
  }

  // If user is not authenticated, show navigation menu with dropdowns
  return (
    <nav ref={navRef} className="hidden md:flex items-center">
      <NavigationMenu>
        <NavigationMenuList>
          {menuItems.map((menuItem) => (
            <NavigationMenuItem key={menuItem.label}>
              <NavigationMenuTrigger>{menuItem.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {menuItem.items.map((item) => {
                    // Check if this is a Google auth item
                    if (item.isGoogleAuth) {
                      return (
                        <li key={item.label}>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleGoogleAuth}
                          >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                            {item.label}
                          </Button>
                        </li>
                      );
                    }

                    // Regular link or anchor
                    return (
                      <li key={item.label}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href || '#'}
                            onClick={(e) => item.href && handleAnchorClick(e, item.href)}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.label}
                            </div>
                            {item.description && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
