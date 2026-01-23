/**
 * Store Header Component
 *
 * Header section with cover image, avatar, store name,
 * owner badge, description, and action buttons.
 */

import { ArrowLeft, Heart, MoreHorizontal, Share2, Store as StoreIcon, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Store } from '@prisma/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/features/shadcn/components/ui/avatar';
import { Badge } from '@/features/shadcn/components/ui/badge';
import { Button } from '@/features/shadcn/components/ui/button';

export interface StoreHeaderProps {
  store: Store;
  isOwner?: boolean;
}

export function StoreHeader({ store, isOwner = true }: StoreHeaderProps) {
  const initials = store.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500">
        {store.coverImage ? (
          <Image
            src={store.coverImage}
            alt={`${store.name} cover`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" />
        )}

        {/* Top Actions */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
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
      <div className="relative -mt-12 px-6">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          {store.logoUrl ? (
            <AvatarImage src={store.logoUrl} alt={store.name} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
            {initials || <StoreIcon className="h-10 w-10" />}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Store Info */}
      <div className="space-y-4 px-6 pt-4">
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
        <div className="flex gap-3">
          <Button
            disabled
            className="flex-1 gap-2 rounded-full bg-primary"
          >
            <UserPlus className="h-4 w-4" />
            Seguir
          </Button>
          <Button
            disabled
            variant="outline"
            className="flex-1 gap-2 rounded-full"
          >
            <Heart className="h-4 w-4" />
            Me gusta
          </Button>
        </div>
      </div>
    </div>
  );
}
