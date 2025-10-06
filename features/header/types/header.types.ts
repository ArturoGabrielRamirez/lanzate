import { User } from '@supabase/supabase-js';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavSubItem {
  label: string;
  href?: string;
  description?: string;
  isGoogleAuth?: boolean;
}

export interface NavMenuItem {
  label: string;
  items: NavSubItem[];
}

export interface HeaderProps {
  className?: string;
  user?: User | null;
}

export interface HeaderNavProps {
  menuItems: NavMenuItem[];
  user?: User | null;
  locale?: string;
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
