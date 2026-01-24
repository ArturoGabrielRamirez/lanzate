/**
 * UserAvatar Component Types
 *
 * Props interfaces for user avatar related components.
 */

/**
 * User data required for the avatar menu
 */
export interface UserAvatarData {
  name: string | null;
  email: string;
  image: string | null;
}

/**
 * Props for UserAvatarMenu component (Client Component)
 *
 * Displays the user avatar with a dropdown/drawer menu
 * for profile options and logout.
 */
export interface UserAvatarMenuProps {
  user: UserAvatarData;
}

/**
 * Props for DesktopNavLinks component (Client Component)
 *
 * Desktop navigation links with active state detection.
 * Uses usePathname and useTranslations hooks.
 */
export interface DesktopNavLinksProps {
  className?: string;
}
