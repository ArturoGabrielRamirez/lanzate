'use client';

/**
 * Store Detail Component
 *
 * Displays complete store information with header, admin panel,
 * and tabbed content (products, posts, reviews).
 */

import type { Product, ProductImage, ProductVariant, Store } from '@prisma/client';

import { AdminPanelSection } from '@/features/stores/components/admin-panel-section';
import { StoreConfigLink } from '@/features/stores/components/store-config-link';
import { StoreHeader } from '@/features/stores/components/store-header';
import { StoreTabs } from '@/features/stores/components/store-tabs';

export interface StoreDetailProps {
  store: Store;
  products?: (Product & {
    images?: ProductImage[];
    variants?: ProductVariant[];
  })[];
  productCount?: number;
  branchCount?: number;
}

export function StoreDetail({
  store,
  products = [],
  productCount = 0,
  branchCount = 0,
}: StoreDetailProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6 pb-8">
      {/* Header with cover, avatar, name, buttons */}
      <div className="overflow-hidden rounded-3xl bg-card shadow-sm">
        <StoreHeader store={store} isOwner />
      </div>

      {/* Admin Panel Section */}
      <div className="rounded-3xl bg-muted/50 p-4">
        <AdminPanelSection
          subdomain={store.subdomain}
          productCount={productCount}
          branchCount={branchCount}
        />

        {/* Store Configuration Link */}
        <div className="mt-4">
          <StoreConfigLink subdomain={store.subdomain} />
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="rounded-3xl bg-card p-4 shadow-sm">
        <StoreTabs
          storeSubdomain={store.subdomain}
          products={products}
        />
      </div>
    </div>
  );
}
