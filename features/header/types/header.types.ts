import { LocalUserType } from '@/features/auth/types';

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

export interface UserAvatarProps {
    user: LocalUserType;
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