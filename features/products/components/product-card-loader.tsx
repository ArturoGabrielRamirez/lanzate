import { ProductCardSkeleton } from "@/features/products/components/product-card-skeleton"

function ProductCardLoader() {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4 grow">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
        </div>
    )
}
export { ProductCardLoader }