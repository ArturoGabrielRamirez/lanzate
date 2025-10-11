import type { CurrentUserInfo } from '@/features/global/types';

import type { ReactNode } from 'react';


export interface NavSubItem {
  label: string;
  href: string;
  description?: string;
  isGoogleAuth?: boolean;
  icon?: ReactNode;
}

export interface NavMenuItem {
  label: string;
  icon?: ReactNode;
  items?: NavSubItem[];
  href?: string;
  description?: string;
}

export interface HeaderProps {
  className?: string;
}

export interface UserAvatarProps {
  user: CurrentUserInfo;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
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
