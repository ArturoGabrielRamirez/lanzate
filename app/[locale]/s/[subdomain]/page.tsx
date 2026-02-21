/**
 * Storefront Home Page
 *
 * Public landing page for a store accessed via subdomain.
 * The shell (header + footer + CSS theme) is provided by layout.tsx.
 * This page only renders the configured home sections via SectionRenderer.
 *
 * Route: /[locale]/s/[subdomain]
 * Accessed as: mystore.localhost:3000 (proxy rewrites)
 *
 * Architecture:
 * - Server Component (fetch + render, no interactivity)
 * - Shell (header/footer/theme) provided by layout.tsx
 * - Home sections are configurable via DEFAULT_HOME_SECTIONS (static for now)
 * - ISR with 1-hour revalidation
 */

import { notFound } from 'next/navigation';

import { SectionRenderer } from '@/features/storefront/components/sections/section-renderer';
import { getStorePublicDataAction } from '@/features/stores/actions';
import type { StorefrontPageProps } from '@/features/stores/types';

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

  const storeResult = await getStorePublicDataAction(subdomain);

  if (storeResult.hasError || !storeResult.payload) {
    notFound();
  }

  const { store, homeSections } = storeResult.payload;

  return (
    <main className="flex-1">
      <SectionRenderer
        sections={homeSections}
        store={store}
        storeSubdomain={subdomain}
      />
    </main>
  );
}

export const revalidate = 3600; // ISR: revalidate every hour
