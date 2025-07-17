import { Button } from "@/components/ui/button";
import { Title } from "@/features/layout/components";
import ProductAmountDisplay from "@/features/store-landing/components/product-amount-display";
import ProductCardSkeleton from "@/features/store-landing/components/product-card-skeleton";
import ProductList from "@/features/store-landing/components/product-list";
import ProductListDisplay from "@/features/store-landing/components/product-list-display";
import SidebarFilters from "@/features/store-landing/components/sidebar-filters";
import { loadFilterParams } from "@/features/store-landing/utils/load-filter-params";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

type Props = {
    params: Promise<{ subdomain: string }>
    searchParams: Promise<SearchParams>
}

export default async function StorePage({ params, searchParams }: Props) {
    const { subdomain } = await params
    const { category, sort, search, min, max, page, limit, offset } = await loadFilterParams(searchParams)
    console.log("🚀 ~ StorePage ~ limit:", limit)
    const { payload: storeData, error } = await getStoreWithProducts(subdomain, category, sort, search, min, max, limit);

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

    const paginationMaxAmount = 10;
    const paginationCurrentPage = 1;
    const paginationTotalPages = Math.ceil(storeData.products.length / paginationMaxAmount);

    return (
        <section className="p-4 grow flex flex-col">
            <Title title="My Products" />

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-4 grow">
                <SidebarFilters />
                <div className="flex flex-col gap-4 relative">
                    <div className="flex gap-2 justify-between">
                        <ProductListDisplay />
                        <ProductAmountDisplay />
                        {/* <div className="flex gap-2 items-center">
                            <Button variant="outline">
                                <ChevronLeft />
                            </Button>
                            <p>{paginationCurrentPage} of {paginationTotalPages}</p>
                            <Button variant="outline">
                                <ChevronRight />
                            </Button>
                        </div> */}
                    </div>
                    <div className="flex gap-2">
                        <p>Showing {paginationMaxAmount} of {storeData.products.length} products</p>
                    </div>
                    <Suspense fallback={(
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4 grow">
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                            <ProductCardSkeleton />
                        </div>
                    )} key={category}>
                        <ProductList
                            subdomain={subdomain}
                            category={category}
                            sort={sort}
                            search={search}
                            min={min}
                            max={max}
                            limit={limit}
                        />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}