/**
 * Storefront Home Component
 *
 * Component for displaying store homepage with featured products.
 * Uses Server Components for initial data fetch.
 *
 * Features:
 * - Featured products grid
 * - Store information display
 * - Search navigation
 * - Mobile-responsive layout
 */

import { Search, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'next/link';
import { Suspense } from 'react';

import { getProductsAction } from '@/features/products/actions';
import { ProductGrid } from '@/features/products/components/product-grid';

import type { Store } from '@prisma/client';

/**
 * Props for StorefrontHome component
 */
interface StorefrontHomeProps {
  store: Store;
}

/**
 * Loading skeleton for storefront home
 */
function StorefrontHomeSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4">
            <div className="h-8 w-32 mx-auto animate-pulse rounded bg-muted/50" />
            <div className="h-4 w-64 mx-auto animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-2xl font-bold text-center">
          <div className="h-8 w-48 mx-auto animate-pulse rounded bg-muted" />
        </h2>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Storefront home content component
 */
async function StorefrontHomeContent({ store }: StorefrontHomeProps) {
  // Fetch featured products
  const featuredProductsResult = await getProductsAction({
    storeId: store.id,
    status: 'ACTIVE',
    isFeatured: true,
    pageSize: 8,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    page: 1,
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href={`/s/${store.subdomain}`}
              className="flex items-center gap-2 text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {store.name}
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link 
                href={`/s/${store.subdomain}/products`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Productos</span>
              </Link>
              
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {/* TODO: Add cart count badge */}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Bienvenido a {store.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {store.description || 'Descubre nuestros productos destacados y ofertas especiales.'}
            </p>
            <Link 
              href={`/s/${store.subdomain}/products`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground inline-flex items-center gap-2">
              Productos destacados
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </h2>
            <p className="text-muted-foreground mt-2">
              Los mejores productos seleccionados especialmente para ti
            </p>
          </div>
          
          <Suspense fallback={<StorefrontHomeSkeleton />}>
            <ProductGrid
              products={featuredProductsResult.hasError ? [] : (featuredProductsResult.payload?.data || [])}
              storeSubdomain={store.subdomain}
              emptyMessage="No hay productos destacados disponibles en este momento."
            />
          </Suspense>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            © 2026 {store.name}. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Storefront home component
 */
export function StorefrontHome({ store }: StorefrontHomeProps) {
  return (
    <StorefrontHomeContent store={store} />
  );
}