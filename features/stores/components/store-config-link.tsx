/**
 * Store Config Link Component
 *
 * Link to store configuration/settings page.
 */

import { ChevronRight, Settings } from 'lucide-react';
import Link from 'next/link';

import type { StoreConfigLinkProps } from '@/features/stores/types';

export function StoreConfigLink({ subdomain }: StoreConfigLinkProps) {
  return (
    <Link
      href={`/stores/${subdomain}/settings`}
      className="flex items-center justify-between rounded-2xl bg-card p-4 transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <Settings className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-foreground">
          Configuración de Tienda
        </span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}
