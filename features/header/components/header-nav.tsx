'use client';

import { usePathname } from 'next/navigation';
import { HeaderNavProps } from '../types';
import { HeaderNavLink } from './header-nav-link';

export const HeaderNav = ({ links }: HeaderNavProps) => {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <HeaderNavLink
            key={link.href}
            label={link.label}
            href={link.href}
            isActive={isActive}
          />
        );
      })}
    </nav>
  );
};
