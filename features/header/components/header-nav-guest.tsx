'use client';

import { memo, useCallback } from 'react';

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { googleSignInAction } from '@/features/auth/login/actions';
import { GoogleAuthButton } from '@/features/auth/shared/components/google-auth-button';
import { useSmoothScroll } from '@/features/global/hooks/use-smooth-scroll';
import { HEADER_CONSTANTS } from '@/features/header/constants';
import type { HeaderNavProps } from '@/features/header/types';
import { getIconForHref } from '@/features/header/utils';
import { Link } from '@/i18n/navigation';

export const HeaderNavGuest = memo(({ menuItems }: Pick<HeaderNavProps, 'menuItems'>) => {
  const { scrollToAnchor } = useSmoothScroll(HEADER_CONSTANTS.HEADER_OFFSET_DESKTOP);

  const handleGoogleAuthClick = useCallback(async () => {
    const res = await googleSignInAction();
    if (res.hasError || !res.payload?.url) return;
    window.location.href = res.payload.url;
  }, []);

  return (
    <nav className="hidden md:flex items-center">
      <NavigationMenu>
        <NavigationMenuList>
          {menuItems.map((menuItem) => (
            <NavigationMenuItem key={menuItem.label}>
              <NavigationMenuTrigger>{menuItem.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {menuItem.items.map((item) => {
                    if (item.isGoogleAuth) {
                      return (
                        <li key={item.label}>
                          <GoogleAuthButton
                            label={item.label}
                            onClick={handleGoogleAuthClick}
                            className="w-full justify-start"
                          />
                        </li>
                      );
                    }

                    return (
                      <li key={item.label}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href || '#'}
                            onClick={(e) => {
                              if (!item.href) return;
                              if (item.href.includes('#')) {
                                e.preventDefault();
                                scrollToAnchor(item.href);
                              }
                            }}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none inline-flex items-center">
                              {getIconForHref(item.href)}
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
});

HeaderNavGuest.displayName = 'HeaderNavGuest';


