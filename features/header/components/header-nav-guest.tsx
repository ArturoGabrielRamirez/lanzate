'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { googleSignInAction } from '@/features/auth/login/actions';
import { GoogleAuthButton } from '@/features/auth/shared/components/google-auth-button';
import { useSmoothScroll } from '@/features/global/hooks/use-smooth-scroll';
import { HEADER_OFFSET_DESKTOP, NAV_MENU_ITEMS_GUEST } from '@/features/header/constants';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useMotionValueEvent, useScroll } from 'motion/react';

function HeaderNavGuest() {

  const { scrollToAnchor } = useSmoothScroll(HEADER_OFFSET_DESKTOP);
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { scrollY } = useScroll()

  const [isFloating, setIsFloating] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const windowHeight = window.innerHeight
    if (latest > 100) {
      setIsFloating(true)
    } else {
      setIsFloating(false)
    }
  })

  const handleGoogleAuthClick = useCallback(async () => {
    const res = await googleSignInAction();
    if (res.hasError || !res.payload?.url) return;
    window.location.href = res.payload.url;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.dataset.href;
    if (!href) return;
    if (href.includes('#')) {
      scrollToAnchor(href);
    } else {
      router.push(href);
    }
  }, [scrollToAnchor, router]);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NAV_MENU_ITEMS_GUEST.map((menuItem) => (
          <NavigationMenuItem key={menuItem.label}>
            <NavigationMenuTrigger className={cn("bg-transparent", !isHome && "text-foreground", isFloating && "text-white")}>
              {t(menuItem.label)}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {menuItem.items && menuItem.items.map((item) => {

                  if (item.isGoogleAuth) {
                    return (
                      <li key={item.label} className='row-span-3 col-start-1 row-start-1 flex flex-col gap-2'>
                        <div className="text-sm font-medium leading-none inline-flex items-center gap-2">
                          <div className="group-hover:text-primary">
                            {item.icon}
                          </div>
                          {t(item.label)}
                        </div>
                        {item.description && (
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t(item.description)}
                          </p>
                        )}
                        <GoogleAuthButton
                          label={t(item.label)}
                          onClick={handleGoogleAuthClick}
                          className="w-full grow justify-center"
                        />
                      </li>
                    );
                  }

                  return (
                    <li key={item.label}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href || '#'}
                          data-href={item.href}
                          onClick={handleClick}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/30 hover:text-primary focus:bg-primary focus:text-primary-foreground group"
                        >
                          <div className="text-sm font-medium leading-none inline-flex items-center gap-2">
                            <div className="group-hover:text-primary">
                              {item.icon}
                            </div>
                            {t(item.label)}
                          </div>
                          {item.description && (
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t(item.description)}
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
  );
};

export { HeaderNavGuest };