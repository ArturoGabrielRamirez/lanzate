import { HeaderProps } from '../types';
import { NAV_LINKS } from '../constants';
import { HeaderLogo } from './header-logo';
import { HeaderNav } from './header-nav';
import { HeaderActions } from './header-actions';
import { MobileHeader } from './mobile-header';

export const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={`sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        className || ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <HeaderLogo />

          {/* Desktop Navigation */}
          <HeaderNav links={NAV_LINKS} />

          {/* Desktop Actions */}
          <HeaderActions />

          {/* Mobile Menu Button */}
          <MobileHeader links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
};
