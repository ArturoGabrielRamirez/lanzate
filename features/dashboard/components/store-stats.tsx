'use client';

/**
 * Store Stats Component
 *
 * Displays the user's store cards in a compact layout.
 * Shows real store data and a "New store" card for creating more.
 *
 * Features:
 * - Compact card design using shadcn Card subcomponents
 * - Real store data (name, description, date)
 * - Animated card entrance with framer-motion
 * - "New store" card with dashed border
 * - Link to see all stores
 */

import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Store } from 'lucide-react';
import Link from 'next/link';

import type { StoreStatsProps } from '@/features/dashboard/types';
import { Button } from '@/features/shadcn/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/shadcn/components/ui/card';
import { CreateStoreButtonGate } from '@/features/stores/components/CreateStoreButtonGate';
import { FirstStoreCTA } from '@/features/stores/components/FirstStoreCTA';

/**
 * Format date to localized string
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Truncate text to specified length
 */
function truncateText(text: string | null, maxLength: number): string {
  if (!text) return 'Sin descripción';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function StoreStats({ stores, accountType, totalCount }: StoreStatsProps) {
  const hasStores = stores.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Your Stores ({totalCount})
        </h2>
        {hasStores && (
          <Link href="/stores">
            <Button variant="link" className="text-primary hover:text-primary/80">
              Ver más →
            </Button>
          </Link>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Store Cards - Real Data */}
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className='flex'
          >
            <Link href={`/stores/${store.id}`} className='grow flex'>
              <Card className="gap-2 py-3 transition-shadow hover:shadow-md grow">
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

        {/* New Store Card - Only show if user has existing stores */}
        {hasStores && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: stores.length * 0.1 }}
          >
            <Card className="flex h-full min-h-[120px] items-center justify-center border-2 border-dashed border-border bg-card/50 py-3 transition-colors hover:border-primary/50 hover:bg-card">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">New store</h3>
                  <p className="text-xs text-muted-foreground">
                    Create your store
                    <br />
                    in seconds!
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
