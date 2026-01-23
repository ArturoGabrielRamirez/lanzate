'use client';

/**
 * Store Header Wrapper (Client Component)
 *
 * Conditionally renders the store header based on the current route.
 * Only displays children when the pathname is a store detail route.
 */

import type { StoreHeaderWrapperProps } from '@/features/layout/types';
import { usePathname } from '@/i18n/navigation';


export function StoreHeaderWrapper({ children }: StoreHeaderWrapperProps) {
  const pathname = usePathname();

  // usePathname de next-intl devuelve el path SIN el locale
  // Ej: /es/stores/lodemauri -> /stores/lodemauri
  const isStoreDetailRoute = pathname.startsWith('/stores/') && pathname.split('/').length > 2;

  if (!isStoreDetailRoute) {
    return null;
  }

  return <>{children}</>;
}
