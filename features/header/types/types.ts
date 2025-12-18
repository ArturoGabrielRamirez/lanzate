import type { ReactNode } from 'react';

import { UserType } from '@/features/account/types';
import { LocalUserType } from '@/features/auth/types';
import { WithClassName } from '@/features/global/types';



// Interface base para elementos de navegación
export interface BaseNavElement {
    label: string;
    href: string;
    description?: string;
    icon?: ReactNode;
}

// Interface base para elementos con tamaño
export interface BaseSizedElement {
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
    user: UserType | LocalUserType;
}

// NavLinkWithUnderlineProps - extiende BaseNavElement
export interface NavLinkWithUnderlineProps extends BaseNavElement {
    isActive?: boolean;
    prefetch?: boolean;
    disabled?: boolean;
}

// BaseHeaderProps - Props para el componente base del header
export interface BaseHeaderProps extends WithClassName {
    children: ReactNode;
    variant?: 'fixed' | 'absolute' | 'sticky';
}

// PrivateHeaderProps - Props para el header de rutas privadas
export interface PrivateHeaderProps extends WithClassName {
    user: UserType | null;
    storesCount: number;
}

// PublicHeaderProps - Props para el header de rutas públicas
export type PublicHeaderProps = WithClassName;

// HeaderActionsProps - Props para las acciones del header
export interface HeaderActionsProps extends WithClassName {
    showLogin?: boolean;
}

// MobileDrawerProps - Props para el drawer móvil
export interface MobileDrawerProps {
    user: UserType | LocalUserType | null;
    menuItems: NavSubItem[];
}

// HeaderNavAuthProps - Props para navegación autenticada
export interface HeaderNavAuthProps {
    storesCount: number;
}

// HeaderNavContainerProps - Props para contenedor de navegación
export interface HeaderNavContainerProps {
    children: ReactNode;
}
