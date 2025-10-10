'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { isAuthenticated } from '@/features/global/utils';
import { NavLinkWithUnderline } from '@/features/header/components/nav-link-with-underline';
import type { HeaderNavProps } from '@/features/header/types';
import { isActiveRoute, getAuthNavLinks } from '@/features/header/utils';

function HeaderNavAuth({ user }: Pick<HeaderNavProps, 'user'>) {
  const pathname = usePathname();
  const t = useTranslations();

  const navLinks = useMemo(() => getAuthNavLinks(t), [t]);

  if (!isAuthenticated(user)) return null;


  return (
    <>
      {navLinks.map((link) => {
        const isActive = isActiveRoute(pathname, link.href);
        return (
          <NavLinkWithUnderline
            key={link.href}
            href={link.href}
            label={(<span className="inline-flex items-center">{link.icon}{link.label}</span>) as unknown as string}
            isActive={isActive}
            prefetch
          />
        );
      })}
    </>
  );
};

export { HeaderNavAuth };