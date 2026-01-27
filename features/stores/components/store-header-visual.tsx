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

import { Store as StoreIcon } from 'lucide-react';
import * as motion from "motion/react-client"
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/features/shadcn/components/ui/avatar';
import { Badge } from '@/features/shadcn/components/ui/badge';
import { StoreHeaderToolbar } from '@/features/stores/components/store-header-toolbar';
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
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 0.4, y: 0 }}
        className="absolute inset-0 h-48 max-h-48 overflow-hidden rounded-b-lg flex pb-4 px-4"
      >
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


      </motion.div>



      <div className='flex container mx-auto z-10 relative gap-4 h-32 px-2 items-end pb-2'>

        {/* Avatar - Overlapping */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 75 }}
          animate={{ opacity: 1, scale: 1, y: 35 }}
          className="relative container mx-auto w-fit"
        >
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            {store.logoUrl ? (
              <AvatarImage src={store.logoUrl} alt={store.name} />
            ) : null}
            <AvatarFallback className="bg-primary/80 backdrop-blur-lg text-2xl font-semibold text-primary-foreground">
              {initials || <StoreIcon className="h-10 w-10" />}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Store Info */}
        <div className="shrink-0">
          {/* Name and Badge */}
          <div className="flex flex-wrap items-end gap-2 shrink-0">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-foreground md:text-4xl"
            >
              {store.name}
            </motion.h1>
            {isOwner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  PROPIETARIO
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            {store.description || 'Sin descripción'}
          </motion.p>
          
        </div>

        <StoreHeaderToolbar store={store} isOwner={isOwner} />

      </div>
    </>
  );
}
