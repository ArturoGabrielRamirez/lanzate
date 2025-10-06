import { User } from '@supabase/supabase-js';

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  className?: string;
  user?: User | null;
}

export interface HeaderNavProps {
  links: NavLink[];
}

export interface HeaderNavLinkProps {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface MobileHeaderProps {
  links: NavLink[];
  user?: User | null;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  links: NavLink[];
  user?: User | null;
}
