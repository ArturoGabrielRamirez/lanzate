'use client';

import { HeaderNavLinkProps } from '../types';

export const HeaderNavLink = ({ label, href }: HeaderNavLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.split('#')[1];
    const element = document.getElementById(targetId);
    
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="relative px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary group"
    >
      {label}
      <span
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform scale-x-0 group-hover:scale-x-100"
      />
    </a>
  );
};
