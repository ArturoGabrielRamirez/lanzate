/**
 * Store Detail Component
 *
 * Displays store content tabs (products, posts, reviews).
 * The admin sidebar is now rendered in the store subdomain layout.
 *
 * Note: StoreHeader is rendered in the store layout (PrivateHeader).
 */

import { StoreTabs } from '@/features/stores/components/store-tabs';
import type { StoreDetailProps } from '@/features/stores/types';

export function StoreDetail({
  store,
  products = [],
}: StoreDetailProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-card p-4 shadow-sm">
        <StoreTabs storeSubdomain={store.subdomain} products={products} />
      </div>
    </div>
  );
}
