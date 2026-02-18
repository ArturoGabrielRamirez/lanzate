/**
 * PrivateHeader Component (Server Component)
 *
 * Navigation header for authenticated private routes.
 * This is a server component that composes the client-side
 * navigation (PrivateHeaderNav).
 *
 * The PrivateHeaderNav is absolutely positioned on top of the
 * StoreHeaderBar/ProfileHeaderBar so the banner extends behind the nav bar.
 */

import { Suspense } from 'react';

import { PrivateHeaderNav } from '@/features/layout/components/private-header-nav';
import { ProfileHeaderWrapper } from '@/features/layout/components/profile-header-wrapper';
import { StoreHeaderWrapper } from '@/features/layout/components/store-header-wrapper';
import { ProfileHeaderBar, ProfileHeaderSkeleton } from '@/features/profile/components';
import { StoreHeaderBar, StoreHeaderSkeleton } from '@/features/stores/components';

export function PrivateHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="relative min-h-16">
        <StoreHeaderWrapper>
          <Suspense fallback={<StoreHeaderSkeleton />}>
            <StoreHeaderBar subdomain={"lodemauri"} />
          </Suspense>
        </StoreHeaderWrapper>
        <ProfileHeaderWrapper>
          <Suspense fallback={<ProfileHeaderSkeleton />}>
            <ProfileHeaderBar />
          </Suspense>
        </ProfileHeaderWrapper>
        <div className="absolute inset-x-0 top-0">
          <PrivateHeaderNav />
        </div>
      </div>
    </header>
  );
}
