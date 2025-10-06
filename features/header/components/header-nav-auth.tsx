'use client';

import { memo, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { isAuthenticated } from '@/features/global/utils';
import { HeaderNavProps } from '../types';
import { NavLinkWithUnderline } from './nav-link-with-underline';
import { LayoutDashboard, PlusCircle, Store, User as UserIcon } from 'lucide-react';
import { isActiveRoute, getAuthNavLinks } from '../utils/navigation.utils';

export const HeaderNavAuth = memo(({ user }: Pick<HeaderNavProps, 'user'>) => {
  const pathname = usePathname();
  const t = useTranslations();

  if (!isAuthenticated(user)) return null;

  const navLinks = useMemo(() => getAuthNavLinks(t), [t]);

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map((link) => {
        const isActive = isActiveRoute(pathname, link.href);
        const icon =
          link.href === '/dashboard' ? (
            <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
          ) : link.href === '/new-sale' ? (
            <PlusCircle className="mr-2 h-4 w-4" aria-hidden />
          ) : link.href === '/stores' ? (
            <Store className="mr-2 h-4 w-4" aria-hidden />
          ) : (
            <UserIcon className="mr-2 h-4 w-4" aria-hidden />
          );

        return (
          <NavLinkWithUnderline
            key={link.href}
            href={link.href}
            label={
              <span className="inline-flex items-center">{icon}{link.label}</span> as unknown as string
            }
            isActive={isActive}
            prefetch
          />
        );
      })}
    </nav>
  );
});

HeaderNavAuth.displayName = 'HeaderNavAuth';


