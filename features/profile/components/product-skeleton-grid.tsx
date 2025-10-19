import { ProductSkeleton } from "./product-skeleton";

export function ProductSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(count)].map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    )
}