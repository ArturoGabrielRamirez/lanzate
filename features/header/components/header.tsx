import { getTranslations } from 'next-intl/server';

import { HeaderActions } from '@/features/header/components/header-actions';
import { HeaderLogo } from '@/features/header/components/header-logo';
import { HeaderNav } from '@/features/header/components/header-nav';
import { MobileHeader } from '@/features/header/components/mobile-header';
import { getNavLinks } from '@/features/header/constants';
import type { HeaderProps } from '@/features/header/types';
import { cn } from '@/lib/utils';

async function Header({ className, user }: HeaderProps) {

  const t = await getTranslations();
  const NAV_LINKS = getNavLinks(t);


  return (
    <header
      className={cn(
        "absolute top-0 z-30 w-full text-primary-foreground",
        className
      )}
    >
      <div className="container mx-auto px-4 flex h-14 md:h-20 items-center justify-between">
        <HeaderLogo />
        <HeaderNav user={user || null} />
        <HeaderActions user={user || null} />
        <MobileHeader links={NAV_LINKS} user={user || null} />
      </div>
    </header>
  );
};

export { Header };