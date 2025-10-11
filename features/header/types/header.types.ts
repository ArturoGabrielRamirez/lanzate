import { UserAppMetadata, UserMetadata } from '@supabase/supabase-js';

import type { CurrentUserInfo } from '@/features/global/types';


import type { ReactNode } from 'react';


export interface NavLink {
  label: string;
  href: string;
  icon?: ReactNode;
}

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

export interface HeaderCurrentUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  accountType: string | null;

  app_metadata: UserAppMetadata;
  user_metadata: UserMetadata;
  aud: string;
  created_at: string;
}

export interface HeaderProps {
  className?: string;
}

export interface MobileHeaderProps {
  user?: CurrentUserInfo | null;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  user?: CurrentUserInfo | null;
}

export interface UserAvatarProps {
  user: CurrentUserInfo;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface UserMenuProps {
  user: CurrentUserInfo;
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
