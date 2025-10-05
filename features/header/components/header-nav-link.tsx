'use client';

import Link from 'next/link';
import { HeaderNavLinkProps } from '../types';

export const HeaderNavLink = ({ label, href, isActive }: HeaderNavLinkProps) => {
  return (
    <Link
      href={href}
      className="relative px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </Link>
  );
};
