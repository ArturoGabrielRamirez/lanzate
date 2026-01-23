/**
 * Store Detail Component
 *
 * Displays store content with responsive layout:
 * - Admin Panel (1/3 left on desktop)
 * - Tabs with products/posts/reviews (2/3 right on desktop)
 *
 * Note: StoreHeader is now rendered in the store layout.
 */

import { AdminPanelSection } from '@/features/stores/components/admin-panel-section';
import { StoreConfigLink } from '@/features/stores/components/store-config-link';
import { StoreTabs } from '@/features/stores/components/store-tabs';
import type { StoreDetailProps } from '@/features/stores/types';

export function StoreDetail({
  store,
  products = [],
  productCount = 0,
  branchCount = 0,
}: StoreDetailProps) {
  return (
    <div className="pb-8">
      {/* Constrained content */}
      <div className="mx-auto container space-y-6 pt-6">
        {/* Desktop: 3-column grid (Admin 1/3 left, Tabs 2/3 right) / Mobile: Stacked */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Admin Panel - 1 column on desktop (left) */}
          <div className="space-y-4 lg:col-span-1">
            <div className="rounded-3xl bg-muted/50 p-4">
              <AdminPanelSection
                subdomain={store.subdomain}
                productCount={productCount}
                branchCount={branchCount}
              />
            </div>
            <StoreConfigLink subdomain={store.subdomain} />
          </div>

          {/* Tabs - 2 columns on desktop (right) */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-card p-4 shadow-sm">
              <StoreTabs storeSubdomain={store.subdomain} products={products} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
