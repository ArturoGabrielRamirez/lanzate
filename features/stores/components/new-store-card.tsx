'use client';

/**
 * New Store Card Component
 *
 * Dashed-border card for creating a new store.
 * Includes animation support and store limit gating.
 *
 * @example
 * ```tsx
 * <NewStoreCard currentStoreCount={2} accountType="FREE" index={3} />
 * ```
 */

import { motion } from 'framer-motion';
import { Store } from 'lucide-react';

import { Avatar } from '@/features/global/components/avatar/avatar';
import { Text } from '@/features/global/components/typography/text/text';
import { Title } from '@/features/global/components/typography/title/title';
import { Card } from '@/features/shadcn/components/ui/card';
import { CreateStoreButtonGate } from '@/features/stores/components/create-store-button-gate';
import type { NewStoreCardProps } from '@/features/stores/types';

const DEFAULT_ANIMATION_DELAY = 0.1;

export function NewStoreCard({
  currentStoreCount,
  accountType,
  index = 0,
  animationDelay = DEFAULT_ANIMATION_DELAY,
}: NewStoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * animationDelay }}
    >
      <Card className="flex h-full min-h-30 items-center justify-center border-2 border-dashed border-border bg-card/50 py-3 transition-colors hover:border-primary/50 hover:bg-card">
        <div className="flex flex-col items-center gap-2 w-full">
          <Avatar size="sm">
            <Store />
          </Avatar>
          <div>
            <Title size='sm' className='text-center'>Nueva tienda</Title>
            <Text size='xs'>
              Crea tu tienda en segundos!
            </Text>
          </div>
          <CreateStoreButtonGate
            currentStoreCount={currentStoreCount}
            accountType={accountType}
          />
        </div>
      </Card>
    </motion.div>
  );
}
