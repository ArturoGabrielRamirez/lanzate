'use client';

/**
 * Profile Header Wrapper (Client Component)
 *
 * Conditionally renders the profile header based on the current route.
 * Only displays children when the pathname is a profile route.
 */

import type { ProfileHeaderWrapperProps } from '@/features/layout/types';
import { usePathname } from '@/i18n/navigation';


export function ProfileHeaderWrapper({ children }: ProfileHeaderWrapperProps) {
  const pathname = usePathname();

  // usePathname from next-intl returns the path WITHOUT the locale
  // e.g.: /es/profile -> /profile
  const isProfileRoute = pathname.startsWith('/profile');

  if (!isProfileRoute) {
    return null;
  }

  return <>{children}</>;
}
