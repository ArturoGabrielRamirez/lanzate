import { ProductSkeleton } from '@/features/products/components/profile/product-skeleton';
import type { ProductSkeletonGridProps } from "@/features/products/types";

function ProductSkeletonGrid({ count = 6 }: ProductSkeletonGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(count)].map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    )
}

export { ProductSkeletonGrid }