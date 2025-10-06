import type { ReactNode } from 'react';

export interface NavLink {
  label: string;
  href: string;
  icon?: ReactNode;
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

export interface HeaderCurrentUser {
  id: number;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  accountType: string | null;
}

export interface HeaderProps {
  className?: string;
  user?: HeaderCurrentUser | null;
}

export interface HeaderNavProps {
  menuItems: NavMenuItem[];
  user?: HeaderCurrentUser | null;
}

export interface MobileHeaderProps {
  links: NavLink[];
  user?: HeaderCurrentUser | null;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  links: NavLink[];
  user?: HeaderCurrentUser | null;
}

export interface HeaderActionsProps {
  user?: HeaderCurrentUser | null;
}

export interface UserAvatarProps {
  user: HeaderCurrentUser;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface UserMenuProps {
  user: HeaderCurrentUser;
}

export interface NavLinkWithUnderlineProps {
  href: string;
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  prefetch?: boolean;
}

export interface SettingsToolbarProps {
  className?: string;
}
