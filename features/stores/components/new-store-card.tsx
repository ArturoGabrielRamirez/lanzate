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
      <Card className="flex h-full min-h-[120px] items-center justify-center border-2 border-dashed border-border bg-card/50 py-3 transition-colors hover:border-primary/50 hover:bg-card">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Nueva tienda</h3>
            <p className="text-xs text-muted-foreground">
              Crea tu tienda
              <br />
              en segundos!
            </p>
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
