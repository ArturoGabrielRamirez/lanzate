import { Button } from "@/components/ui/button";
import { Title } from "@/features/layout/components";
import ProductCardSkeleton from "@/features/store-landing/components/product-card-skeleton";
import ProductList from "@/features/store-landing/components/product-list";
import SidebarFilters from "@/features/store-landing/components/sidebar-filters";
import { loadFilterParams } from "@/features/store-landing/utils/load-filter-params";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
import { ChevronLeft, ChevronRight, Grid2X2, List } from "lucide-react";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

type Props = {
    params: Promise<{ subdomain: string }>
    searchParams: Promise<SearchParams>
}

export default async function StorePage({ params, searchParams }: Props) {
    const { subdomain } = await params
    const { payload: storeData, error } = await getStoreWithProducts(subdomain);
    const { category, price, sort, search } = await loadFilterParams(searchParams)

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
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Grid2X2 />
                            </Button>
                            <Button variant="outline">
                                <List />
                            </Button>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button variant="outline">
                                <ChevronLeft />
                            </Button>
                            <p>{paginationCurrentPage} of {paginationTotalPages}</p>
                            <Button variant="outline">
                                <ChevronRight />
                            </Button>
                        </div>
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
                        <ProductList subdomain={subdomain} category={category} />
                    </Suspense>
                </div>
            </div>
        </section>
    );
}