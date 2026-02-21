/**
 * Storefront Home Page
 *
 * Public landing page for a store accessed via subdomain.
 * Shows the store header and featured/recent active products.
 *
 * Route: /[locale]/s/[subdomain]
 * Accessed as: mystore.localhost:3000 (proxy rewrites)
 *
 * Architecture:
 * - Server Component (fetch + render, no interactivity)
 * - action → service → data flow for store data
 * - 404 if subdomain not found
 * - ISR with 1-hour revalidation
 */

import { notFound } from 'next/navigation';

import { getProductsAction } from '@/features/products/actions';
import { StorefrontFooter, StorefrontHeader, StorefrontLayout, StorefrontProductGrid } from '@/features/storefront/components';
import { getStorePublicDataAction } from '@/features/stores/actions';
import type { StorefrontPageProps } from '@/features/stores/types';
import { Link } from '@/i18n/navigation';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
  const { subdomain } = await params;
  const result = await getStorePublicDataAction(subdomain);

  if (result.hasError || !result.payload) {
    return { title: 'Tienda no encontrada', robots: { index: false, follow: false } };
  }

  const { store } = result.payload;

  return {
    title: store.name,
    description: store.description ?? `Bienvenido a ${store.name}`,
    openGraph: {
      title: store.name,
      description: store.description ?? `Bienvenido a ${store.name}`,
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const { subdomain } = await params;

  // action → service → data
  const storeResult = await getStorePublicDataAction(subdomain);

  if (storeResult.hasError || !storeResult.payload) {
    notFound();
  }

  const { store, theme } = storeResult.payload;

  // Fetch featured active products for the home section
  const productsResult = await getProductsAction({
    storeId: store.id,
    status: 'ACTIVE',
    isFeatured: true,
    pageSize: 8,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
  });

  const featuredProducts = productsResult.payload?.data ?? [];

  return (
    <StorefrontLayout store={store} theme={theme}>
      <StorefrontHeader store={store} theme={theme} />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="py-16"
          style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--sf-primary) 10%, transparent), color-mix(in srgb, var(--sf-primary) 4%, transparent))` }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1
              className="text-4xl font-bold tracking-tight md:text-5xl"
              style={{ color: 'var(--sf-text)' }}
            >
              Bienvenido a {store.name}
            </h1>
            {store.description && (
              <p
                className="mx-auto mt-4 max-w-xl text-lg"
                style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}
              >
                {store.description}
              </p>
            )}
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--sf-primary)',
                borderRadius: 'var(--sf-radius)',
              }}
            >
              Ver todos los productos
            </Link>
          </div>
        </section>

        {/* Featured products */}
        <section className="container mx-auto px-4 py-12">
          <h2
            className="mb-6 text-2xl font-bold"
            style={{ color: 'var(--sf-text)' }}
          >
            {featuredProducts.length > 0 ? 'Productos destacados' : 'Últimos productos'}
          </h2>
          <StorefrontProductGrid
            products={featuredProducts as any}
            storeSubdomain={subdomain}
            emptyMessage="Próximamente habrá productos disponibles."
          />
          {featuredProducts.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/products"
                className="text-sm font-medium underline underline-offset-4"
                style={{ color: 'var(--sf-primary)' }}
              >
                Ver catálogo completo →
              </Link>
            </div>
          )}
        </section>
      </main>

      {theme.showFooter && <StorefrontFooter store={store} />}
    </StorefrontLayout>
  );
}

export const revalidate = 3600; // ISR: revalidate every hour