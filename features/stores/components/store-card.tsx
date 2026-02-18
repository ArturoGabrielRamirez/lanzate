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

import { Button } from '@/features/global/components/button/button';
import { Text } from '@/features/global/components/typography/text/text';
import { Title } from '@/features/global/components/typography/title/title';
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
                <Title size='sm'>
                  {truncateText(store.name, 20)}
                </Title>
              </CardTitle>
            </div>
            <CardAction>
              <Button
                onClick={(e) => e.preventDefault()}
                size="icon"
                variant="outline"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="grow py-0">
            <CardDescription className="text-xs">
              <Text size='xs'>
                {truncateText(store.description, 40)}
              </Text>
            </CardDescription>
          </CardContent>
          <CardFooter className="py-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <Text size='xs'>{formatDate(store.createdAt)}</Text>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
