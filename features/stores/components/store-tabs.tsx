'use client';

/**
 * Store Tabs Component
 *
 * Tabbed navigation for store content: Products, Posts, Reviews.
 */

import type { Product, ProductImage, ProductVariant, ProductReview } from '@prisma/client';

import { ProductGrid } from '@/features/products/components/product-grid';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shadcn/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/features/shadcn/components/ui/avatar';
import { Star } from 'lucide-react';

export interface StoreTabsProps {
  storeSubdomain: string;
  products: (Product & {
    images?: ProductImage[];
    variants?: ProductVariant[];
  })[];
  reviews?: (ProductReview & {
    user?: {
      name: string | null;
      image: string | null;
    };
  })[];
}

export function StoreTabs({
  storeSubdomain,
  products,
  reviews = [],
}: StoreTabsProps) {
  return (
    <Tabs defaultValue="productos" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="productos"
          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Productos
        </TabsTrigger>
        <TabsTrigger
          value="publicaciones"
          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Publicaciones
        </TabsTrigger>
        <TabsTrigger
          value="resenas"
          className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Reseñas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="productos" className="mt-4">
        <ProductGrid products={products} storeSubdomain={storeSubdomain} />
      </TabsContent>

      <TabsContent value="publicaciones" className="mt-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            Próximamente: publicaciones de la tienda
          </p>
        </div>
      </TabsContent>

      <TabsContent value="resenas" className="mt-4">
        {reviews.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reseñas de la comunidad</h3>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              Aún no hay reseñas para esta tienda
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

interface ReviewCardProps {
  review: ProductReview & {
    user?: {
      name: string | null;
      image: string | null;
    };
  };
}

function ReviewCard({ review }: ReviewCardProps) {
  const userName = review.user?.name || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();

  // Format date
  const formattedDate = new Intl.RelativeTimeFormat('es', { numeric: 'auto' }).format(
    Math.ceil((review.createdAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );

  return (
    <div className="rounded-2xl bg-card p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          {review.user?.image ? (
            <AvatarImage src={review.user.image} alt={userName} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary">
            {userInitial}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>

          {/* Rating Stars */}
          <div className="mt-1 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-muted text-muted'
                }`}
              />
            ))}
          </div>

          {/* Review Text */}
          {review.body && (
            <p className="mt-2 text-sm italic text-muted-foreground">
              "{review.body}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
