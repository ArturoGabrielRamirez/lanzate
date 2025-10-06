'use client';

import { Link } from '@/i18n/navigation';

interface NavLinkWithUnderlineProps {
  href: string;
  label: string;
  isActive?: boolean;
  prefetch?: boolean;
}

export const NavLinkWithUnderline = ({ href, label, isActive = false, prefetch = true }: NavLinkWithUnderlineProps) => {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={`relative px-3 py-2 text-sm font-medium transition-colors group ${isActive ? 'text-primary' : 'text-foreground hover:text-primary'
        }`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`}
      />
    </Link>
  );
};


