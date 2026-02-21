/**
 * Product Detail Page
 *
 * Server component for displaying individual product details.
 * Uses Next.js 16 generateMetadata for SEO optimization.
 * Implements ISR for performance with 1-hour revalidation.
 *
 * Features:
 * - SEO metadata generation
 * - Product image gallery
 * - Variant selection
 * - Reviews display
 * - Structured data (JSON-LD)
 */

import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getProductBySlugAction } from '@/features/products/actions';
import { ProductImageGallery } from '@/features/products/components/product-image-gallery';
import { ProductReviews } from '@/features/products/components/product-reviews';
import { ProductVariantSection } from '@/features/products/components/product-variant-section';
import type { ProductDetailPageProps, ProductDetailContentProps, VariantWithRelations } from '@/features/products/types/product-detail.types';

import type { Metadata } from 'next';

/**
 * Generate SEO metadata for product detail page
 *
 * Uses product SEO fields or falls back to product data.
 * Generates OpenGraph tags, canonical URLs, and structured data.
 */
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { subdomain, slug } = await params;

  // Get product data for metadata generation
  const productResult = await getProductBySlugAction(slug, subdomain);

  if (productResult.hasError || !productResult.payload) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe o no está disponible.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const product = productResult.payload;

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description,
    /* openGraph: {
      title: product.name,
      description: product.seoDescription || product.description,
      type: 'product',
      images: product.images && product.images.length > 0 
        ? [{
            url: product.images[0].url,
            width: 1200,
            height: 1200,
            alt: product.images[0].altText || product.name,
          }]
        : [],
      url: `https://${subdomain}.lanzate.app/s/${subdomain}/products/${slug}`,
      siteName: product.store?.name || 'Tienda',
    }, */
    /* twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.seoDescription || product.description,
      images: product.images && product.images.length > 0 
        ? [product.images[0].url]
        : [],
    }, */
    alternates: {
      canonical: `/s/${subdomain}/products/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  };
}

/**
 * Loading skeleton for product detail page
 */
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-8 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

/**
 * Main product detail content component
 */
function ProductDetailContent({ product, storeSubdomain }: ProductDetailContentProps) {
  const averageRating = 4.5; // TODO: Calculate from reviews
  const totalReviews = 23; // TODO: Get from reviews count

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Images and Gallery */}
        <div className="space-y-4">
          <Suspense
            fallback={<div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />}
          >
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </Suspense>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Product Name, Price, and Variant Selectors */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {product.name}
            </h1>
            <ProductVariantSection
              variants={(product.variants || []) as VariantWithRelations[]}
            />
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Descripción
              </h2>
              <div className="prose prose-sm text-muted-foreground">
                <p>{product.description}</p>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <Suspense
              fallback={<div className="space-y-2 animate-pulse"><div className="h-4 w-full rounded bg-muted" /></div>}
            >
              <ProductReviews
                productId={product.id}
                initialReviews={[]} // TODO: Load reviews
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Product detail page with ISR
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { subdomain, slug } = await params;

  // Fetch product data
  const productResult = await getProductBySlugAction(slug, subdomain);

  if (productResult.hasError || !productResult.payload) {
    notFound();
  }

  return (
    <ProductDetailContent
      product={productResult.payload}
      storeSubdomain={subdomain}
    />
  );
}

/**
 * Enable ISR for product pages
 * Revalidate every hour to keep prices and inventory fresh
 */
export const revalidate = 3600; // 1 hour in seconds