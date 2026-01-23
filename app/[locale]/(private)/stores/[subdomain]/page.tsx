import { notFound, redirect } from 'next/navigation';

import { getAuthUser } from '@/features/auth/utils';
import { getStoreDetailAction } from '@/features/stores/actions/get-store-detail.action';
import { StoreDetail } from '@/features/stores/components/store-detail';
import type { StorefrontPageProps } from '@/features/stores/types';
import { prisma } from '@/lib/prisma';

/**
 * Store Detail Page
 *
 * Displays detailed information about a store owned by the user.
 * Verifies ownership before showing store data.
 */
export default async function StoreDetailPage({ params }: StorefrontPageProps) {
  const { subdomain } = await params;

  // Check authentication status
  const user = await getAuthUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Fetch store detail with ownership verification
  const result = await getStoreDetailAction(subdomain);

  // Handle not found
  if (result.hasError || !result.payload) {
    notFound();
  }

  const store = result.payload;

  // Fetch additional data in parallel
  const [productsWithRelations, branchCount] = await Promise.all([
    // Fetch products with images and variants for display
    prisma.product.findMany({
      where: {
        storeId: store.id,
        status: 'ACTIVE',
      },
      include: {
        images: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit for initial display
    }),
    // Count branches
    prisma.branch.count({
      where: { storeId: store.id },
    }),
  ]);

  // Count total active products
  const productCount = await prisma.product.count({
    where: {
      storeId: store.id,
      status: 'ACTIVE',
    },
  });

  return (
    <div className="min-h-screen bg-[#f8f5f2] dark:bg-background">
      <main className="container mx-auto px-4 py-6">
        <StoreDetail
          store={store}
          products={productsWithRelations}
          productCount={productCount}
          branchCount={branchCount}
        />
      </main>
    </div>
  );
}
