'use client';

import { memo, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { isAuthenticated } from '@/features/global/utils';
import { HeaderNavProps } from '../types';
import { NavLinkWithUnderline } from './nav-link-with-underline';
import { isActiveRoute, getAuthNavLinks } from '../utils/navigation.utils';

export const HeaderNavAuth = memo(({ user }: Pick<HeaderNavProps, 'user'>) => {
  const pathname = usePathname();
  const t = useTranslations();

  if (!isAuthenticated(user)) return null;

  const navLinks = useMemo(() => getAuthNavLinks(t), [t]);

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map((link) => (
        <NavLinkWithUnderline
          key={link.href}
          href={link.href}
          label={link.label}
          isActive={isActiveRoute(pathname, link.href)}
          prefetch
        />
      ))}
    </nav>
  );
});

HeaderNavAuth.displayName = 'HeaderNavAuth';


