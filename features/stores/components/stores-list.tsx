'use client';

/**
 * Stores List Component
 *
 * Displays all user's stores in a grid layout.
 * Used on the /stores page to show all stores without limit.
 *
 * Features:
 * - Grid layout with store cards
 * - Animated card entrance with framer-motion
 * - "New store" card with dashed border
 * - Link to store detail page
 */

import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Store } from 'lucide-react';
import Link from 'next/link';

import { SectionHeader } from '@/features/dashboard/components/section-header';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/shadcn/components/ui/card';
import { CreateStoreButtonGate } from '@/features/stores/components/create-store-button-gate';
import { FirstStoreCTA } from '@/features/stores/components/first-store-cta';
import type { StoresListProps } from '@/features/stores/types';
import { formatDate, truncateText } from '@/features/stores/utils';

export function StoresList({ stores, accountType, totalCount }: StoresListProps) {
  const hasStores = stores.length > 0;

  return (
    <div>
      <SectionHeader title="Tus Tiendas" count={totalCount} />

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Store Cards */}
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
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
                <CardContent className="py-0">
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
        ))}

        {/* New Store Card - Always show */}
        {hasStores && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: stores.length * 0.05 }}
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
                  currentStoreCount={totalCount}
                  accountType={accountType}
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* First Store CTA - Only show if no stores */}
        {!hasStores && (
          <FirstStoreCTA currentStoreCount={0} accountType={accountType} />
        )}
      </div>
    </div>
  );
}
