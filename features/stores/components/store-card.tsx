'use client';

/**
 * Store Card Component
 *
 * Individual store card with animation support.
 * Displays store name, description, and creation date.
 *
 * @example
 * ```tsx
 * <StoreCard store={store} index={0} animationDelay={0.1} />
 * ```
 */

import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Store } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/shadcn/components/ui/card';
import type { StoreCardProps } from '@/features/stores/types';
import { formatDate, truncateText } from '@/features/stores/utils';

const DEFAULT_ANIMATION_DELAY = 0.1;

export function StoreCard({
  store,
  index = 0,
  animationDelay = DEFAULT_ANIMATION_DELAY,
}: StoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * animationDelay }}
      className="flex"
    >
      <Link href={`/stores/${store.subdomain}`} className="flex grow">
        <Card className="grow gap-2 py-3 transition-shadow hover:shadow-md">
          <CardHeader className="gap-1 py-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">
                {truncateText(store.name, 20)}
              </CardTitle>
            </div>
            <CardAction>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </CardAction>
          </CardHeader>
          <CardContent className="grow py-0">
            <CardDescription className="text-xs">
              {truncateText(store.description, 40)}
            </CardDescription>
          </CardContent>
          <CardFooter className="py-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(store.createdAt)}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
