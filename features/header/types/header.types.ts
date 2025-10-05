export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  className?: string;
}

export interface HeaderNavProps {
  links: NavLink[];
}

export interface HeaderNavLinkProps {
  label: string;
  href: string;
  isActive: boolean;
}

export interface MobileHeaderProps {
  links: NavLink[];
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  links: NavLink[];
}
