/**
 * PrivateHeader Component (Server Component)
 *
 * Navigation header for authenticated private routes.
 * This is a server component that composes the client-side
 * navigation (PrivateHeaderNav).
 *
 * The StoreHeaderBar is rendered separately in the store layout
 * to maintain server component benefits.
 */

import { Suspense } from 'react';

import { PrivateHeaderNav } from '@/features/layout/components/private-header-nav';
import { StoreHeaderWrapper } from '@/features/layout/components/store-header-wrapper';
import { StoreHeaderBar, StoreHeaderSkeleton } from '@/features/stores/components';

export function PrivateHeader() {
  return (
    <header className="sticky top-0 z-50">
      <PrivateHeaderNav />
      <StoreHeaderWrapper>
        <Suspense fallback={<StoreHeaderSkeleton />}>
          <StoreHeaderBar subdomain={"lodemauri"} />
        </Suspense>
      </StoreHeaderWrapper>
    </header>
  );
}
