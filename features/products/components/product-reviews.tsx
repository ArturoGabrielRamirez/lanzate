/**
 * Product Reviews Component
 *
 * Component for displaying product reviews with ratings.
 * Uses React 19 hooks for state management.
 *
 * Features:
 * - Review list with pagination
 * - Average rating summary
 * - Star rating display
 * - Filter by rating
 */

"use client";

import { useState, useCallback } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Button } from '@/features/shadcn/components/ui/button';
import { cn } from '@/features/shadcn/utils/cn';
import type { 
  ProductReviewsProps, 
  ReviewSummaryProps 
} from '@/features/products/types/product-detail.types';

/**
 * Star rating component
 */
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-muted-foreground/30" />
      ))}
    </div>
  );
}

/**
 * Review summary component
 */
function ReviewSummary({ averageRating, totalReviews, className = "" }: ReviewSummaryProps) {
  return (
    <div className={cn("flex items-center gap-4 text-sm", className)}>
      <div className="flex items-center gap-2">
        <StarRating rating={averageRating} />
        <span className="font-medium text-foreground">
          {averageRating.toFixed(1)}
        </span>
      </div>
      
      <span className="text-muted-foreground">
        ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
      </span>
    </div>
  );
}

/**
 * Individual review component
 */
function ReviewItem({ 
  review, 
  isLast = false 
}: { 
  review: {
    id: string;
    title: string;
    body: string;
    rating: number;
    createdAt: Date;
    user?: {
      name: string;
    };
  };
  isLast?: boolean;
}) {
  return (
    <div className={cn(
      "border-b border-muted pb-4",
      !isLast && "border-b-0"
    )}>
      <div className="flex items-start gap-3 mb-2">
        <StarRating rating={review.rating} size={14} />
        <div className="flex-1">
          <h4 className="font-medium text-foreground">
            {review.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            Por {review.user?.name || 'Cliente anónimo'}
          </p>
        </div>
        <time className="text-sm text-muted-foreground" dateTime={review.createdAt.toISOString()}>
          {review.createdAt.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <p>{review.body}</p>
      </div>
    </div>
  );
}

/**
 * Product reviews list component
 */
export function ProductReviews({ 
  productId, 
  initialReviews = [], 
  averageRating = 0, 
  totalReviews = 0,
  className = "" 
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    try {
      // TODO: Implement pagination with real API
      // const moreReviews = await getProductReviewsAction(productId, reviews.length, 5);
      // setReviews(prev => [...prev, ...moreReviews]);
      // setHasMore(moreReviews.length === 5);
    } catch (error) {
      console.error('Error loading more reviews:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [productId, loadingMore, hasMore, reviews.length]);

  return (
    <div className={className}>
      {/* Summary */}
      {totalReviews > 0 && (
        <div className="mb-6">
          <ReviewSummary 
            averageRating={averageRating} 
            totalReviews={totalReviews}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Todavía no hay reseñas para este producto.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ¡Sé el primero en opinar!
            </p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <ReviewItem 
              key={review.id} 
              review={review} 
              isLast={index === reviews.length - 1}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && reviews.length > 0 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Cargando...' : 'Cargar más reseñas'}
          </Button>
        </div>
      )}
    </div>
  );
}