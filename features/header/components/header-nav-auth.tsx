'use client';

import { usePathname } from 'next/navigation';

import { NavLinkWithUnderline } from '@/features/header/components/nav-link-with-underline';
import { NAV_MENU_ITEMS_AUTH } from '@/features/header/constants';
import { isActiveRoute } from '@/features/header/utils';

function HeaderNavAuth() {

  const pathname = usePathname();

  return (
    <>
      {NAV_MENU_ITEMS_AUTH.map((link) => {
        const isActive = isActiveRoute(pathname, link.href);
        return (
          <NavLinkWithUnderline
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            isActive={isActive}
            prefetch
          />
        );
      })}
    </>
  );
};

export { HeaderNavAuth };