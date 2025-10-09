import { getLocale, getTranslations } from 'next-intl/server';

import { HeaderActions } from '@/features/header/components/header-actions';
import { HeaderLogo } from '@/features/header/components/header-logo';
import { HeaderNav } from '@/features/header/components/header-nav';
import { MobileHeader } from '@/features/header/components/mobile-header';
import { getNavLinks, getNavMenuItemsGuest } from '@/features/header/constants';
import type { HeaderProps } from '@/features/header/types';
import { cn } from '@/lib/utils';

export async function Header({ className, user }: HeaderProps) {

  const t = await getTranslations();
  const locale = await getLocale();
  const NAV_LINKS = getNavLinks(t);
  const NAV_MENU_ITEMS = getNavMenuItemsGuest(t, locale);

  return (
    <header
      className={cn(
        "fixed top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-20 items-center justify-between">
          <HeaderLogo />

          <HeaderNav menuItems={NAV_MENU_ITEMS} user={user || null} />

          <HeaderActions user={user || null} />

          <MobileHeader links={NAV_LINKS} user={user || null} />
        </div>
      </div>
    </header>
  );
};
