'use client';

import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card } from '@/features/shadcn/components/ui/card';
import { CreateStoreButtonGate } from '@/features/stores/components/CreateStoreButtonGate';

import type { AccountType } from '@prisma/client';

interface FirstStoreCTAProps {
  currentStoreCount: number;
  accountType: AccountType;
}

/**
 * FirstStoreCTA Component
 *
 * A call-to-action card displayed when a user has no stores.
 * Encourages first-time users to create their first store.
 *
 * Features:
 * - Store icon in circular background
 * - "Create Your First Store" heading
 * - Brief description text
 * - CreateStoreButtonGate for store creation with limit enforcement
 * - Framer-motion entrance animation
 * - Follows same styling pattern as StoreStats cards
 *
 * @example
 * ```tsx
 * <FirstStoreCTA
 *   currentStoreCount={0}
 *   accountType="FREE"
 * />
 * ```
 */
export function FirstStoreCTA({
  currentStoreCount,
  accountType,
}: FirstStoreCTAProps) {
  const t = useTranslations('store.firstStore');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="col-span-full"
    >
      <Card className="border-border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground">
          {t('heading')}
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          {t('description')}
        </p>
        <CreateStoreButtonGate
          currentStoreCount={currentStoreCount}
          accountType={accountType}
        />
      </Card>
    </motion.div>
  );
}
