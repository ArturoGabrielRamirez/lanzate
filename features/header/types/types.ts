import { LocalUserType } from '@/features/auth/types';
import { WithClassName } from '@/features/global/types';

import type { ReactNode } from 'react';



// Interface base para elementos de navegación
interface BaseNavElement {
    label: string;
    href: string;
    description?: string;
    icon?: ReactNode;
}

// Interface base para elementos con tamaño
interface BaseSizedElement {
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

// BrandLogoProps - extiende BaseElement
export interface BrandLogoProps extends WithClassName {
    hasText?: boolean;
}

// NavSubItem - extiende BaseNavElement
export interface NavSubItem extends BaseNavElement {
    isGoogleAuth?: boolean;
}

// NavMenuItem - extiende BaseNavElement pero hace href opcional
export interface NavMenuItem extends Omit<BaseNavElement, 'href'> {
    href?: string;
    items?: NavSubItem[];
}

// UserAvatarProps - extiende BaseElement y BaseSizedElement
export interface UserAvatarProps extends WithClassName, BaseSizedElement {
    user: LocalUserType;
}

// NavLinkWithUnderlineProps - extiende BaseNavElement
export interface NavLinkWithUnderlineProps extends BaseNavElement {
    isActive?: boolean;
    prefetch?: boolean;
}
