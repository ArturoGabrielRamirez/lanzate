/**
 * Store Header Visual Component
 *
 * Visual adapter that maps a Store record to EntityBanner props.
 * Receives store data via props (no data fetching).
 * Used by StoreHeaderBar which handles data fetching.
 */

"use client";

import { Store as StoreIcon } from 'lucide-react';

import { EntityBanner } from '@/features/global/components/entity-banner/entity-banner';
import { Badge } from '@/features/global/components/badge/badge';
import { StoreHeaderToolbar } from '@/features/stores/components/store-header-toolbar';
import type { StoreHeaderVisualProps } from '@/features/stores/types';

export function StoreHeaderVisual({ store, isOwner = true }: StoreHeaderVisualProps) {
  const initials = store.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const titleNode = (
    <div className="flex flex-wrap items-center gap-2">
      <h1 className="text-3xl font-bold leading-tight text-foreground/95 md:text-4xl">
        {store.name}
      </h1>
      {isOwner && (
        <Badge
          variant="secondary"
          className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        >
          PROPIETARIO
        </Badge>
      )}
    </div>
  );

  return (
    <EntityBanner
      size="lg"
      avatarPosition="overlap-bottom"
      avatarSrc={store.logoUrl ?? undefined}
      avatarAlt={store.name}
      avatarFallback={initials || <StoreIcon className="h-10 w-10" />}
      coverSrc={store.coverImage ?? undefined}
      coverAlt={`${store.name} cover`}
      titleNode={titleNode}
      description={store.description ?? 'Sin descripción'}
      actions={<StoreHeaderToolbar store={store} isOwner={isOwner} />}
      innerClassName="container mx-auto"
      className="rounded-none group"
      bannerClassName="rounded-none border-x-0 border-t-0 pt-16"
    />
  );
}
