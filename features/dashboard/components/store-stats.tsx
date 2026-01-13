'use client';

import { motion } from 'framer-motion';
import { Store, Calendar } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/features/shadcn/components/ui/button';
import { Card } from '@/features/shadcn/components/ui/card';
import { CreateStoreButtonGate } from '@/features/stores/components/CreateStoreButtonGate';
import { FirstStoreCTA } from '@/features/stores/components/FirstStoreCTA';

import type { AccountType } from '@prisma/client';

interface StoreStatsProps {
  storesCount: number;
  accountType: AccountType;
}

/**
 * Store Stats Component
 *
 * Displays the user's store statistics in a card layout.
 * Matches the design from general-dashboard-after-login.png.
 *
 * Features:
 * - Shows stores count with icon
 * - Warm beige/pink background in light theme
 * - Orange accent color for CTAs
 * - Empty state when no stores exist
 * - Link to create new store
 * - Animated card entrance with framer-motion
 */
export function StoreStats({ storesCount, accountType }: StoreStatsProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Your Stores ({storesCount})
        </h2>
        <Link href="/stores">
          <Button variant="link" className="text-primary hover:text-primary/80">
            Ver más →
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Store Card Example - Only show if user has stores */}
        {storesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md">
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">Lo de M...</h3>
                <p className="mb-4 text-sm text-muted-foreground">No description</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>10/16/2025</span>
                  </div>
                  <div>1 products</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* New Store Card - Only show when user has existing stores */}
        {storesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="flex h-full items-center justify-center border-2 border-dashed border-border bg-card/50 transition-colors hover:border-primary/50 hover:bg-card">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-foreground">New store</h3>
                  <p className="text-xs text-muted-foreground">
                    Create your store
                    <br />
                    in seconds!
                  </p>
                </div>
                <CreateStoreButtonGate
                  currentStoreCount={storesCount}
                  accountType={accountType}
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* First Store CTA - Only show if no stores */}
        {storesCount === 0 && (
          <FirstStoreCTA
            currentStoreCount={storesCount}
            accountType={accountType}
          />
        )}
      </div>
    </div>
  );
}
