/**
 * Store Header Visual Component
 *
 * Pure visual component for the store header.
 * Receives store data via props (no data fetching).
 * Used by StoreHeaderBar which handles the data fetching.
 *
 * Header section with cover image, avatar, store name,
 * owner badge, description, and action buttons.
 */

import { ArrowLeft, MoreHorizontal, Share2, Store as StoreIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/features/shadcn/components/ui/avatar';
import { Badge } from '@/features/shadcn/components/ui/badge';
import type { StoreHeaderVisualProps } from '@/features/stores/types';

export function StoreHeaderVisual({ store, isOwner = true }: StoreHeaderVisualProps) {
  const initials = store.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {store.coverImage ? (
        <Image
          src={store.coverImage}
          alt={`${store.name} cover`}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-500 max-h-48" />
      )}
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {/* Top Actions */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between container mx-auto">
          <Link
            href="/stores"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Avatar - Overlapping */}
      <div className="relative -mt-26 container mx-auto">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          {store.logoUrl ? (
            <AvatarImage src={store.logoUrl} alt={store.name} />
          ) : null}
          <AvatarFallback className="bg-primary/80 backdrop-blur-lg text-2xl font-semibold text-primary-foreground">
            {initials || <StoreIcon className="h-10 w-10" />}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Store Info */}
      <div className="space-y-4 pt-4 pb-6 container mx-auto">
        {/* Name and Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">{store.name}</h1>
          {isOwner && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              PROPIETARIO
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground">
          {store.description || 'Sin descripción'}
        </p>

        {/* Action Buttons */}
        {/* <div className="flex gap-3">
          <Button
            disabled
            className="flex-1 gap-2 rounded-full bg-primary sm:flex-none sm:px-8"
          >
            <UserPlus className="h-4 w-4" />
            Seguir
          </Button>
          <Button
            disabled
            variant="outline"
            className="flex-1 gap-2 rounded-full sm:flex-none sm:px-8"
          >
            <Heart className="h-4 w-4" />
            Me gusta
          </Button>
        </div> */}
      </div>
    </>
  );
}
