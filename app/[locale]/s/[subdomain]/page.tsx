/**
 * Storefront Page (Placeholder)
 *
 * Placeholder page for subdomain-based storefront routing.
 * Fetches store by subdomain using server action and displays a simple placeholder.
 * Shows 404 if store is not found.
 *
 * Architecture:
 * - Uses Server Actions (getStoreBySubdomainAction)
 * - Follows action -> data layer pattern
 *
 * Note: Full storefront implementation is OUT OF SCOPE for this feature.
 */
import { notFound } from 'next/navigation';

import { getStoreBySubdomainAction } from '@/features/stores/actions';
import type { StorefrontPageProps } from '@/features/stores/types/store';

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const { subdomain } = await params;

  // Fetch store by subdomain using server action
  const result = await getStoreBySubdomainAction(subdomain);

  // Show 404 if store not found or error
  if (result.hasError || !result.payload) {
    notFound();
  }

  const store = result.payload;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-3xl font-bold">Storefront for {store.name}</h1>
      <p className="text-muted-foreground">Subdomain: {subdomain}</p>
      {store.description && (
        <p className="mt-4 max-w-md text-center text-muted-foreground">
          {store.description}
        </p>
      )}
    </div>
  );
}