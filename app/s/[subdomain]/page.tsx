import { Button } from "@/components/ui/button";
import { Title } from "@/features/layout/components";
/* import ProductCard from "@/features/store-landing/components/product-card"; */
import ProductList from "@/features/store-landing/components/product-list";
import SidebarFilters from "@/features/store-landing/components/sidebar-filters";
import { loadFilterParams } from "@/features/store-landing/utils/load-filter-params";
import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";
/* import { cn } from "@/lib/utils"; */
import { ChevronLeft, ChevronRight, Grid, Grid2X2, List, Search, ShoppingCart } from "lucide-react";
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
                    <Suspense fallback={<div>Loading...</div>}>
                        <ProductList subdomain={subdomain} category={category} />
                    </Suspense>
                    {/* {storeData.products.length > 0 && (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4">
                            {storeData.products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    {storeData.products.length === 0 && (
                        <div className="border-muted-foreground/50 border-2 rounded-md p-4 border-dashed">
                            <p className="text-center text-muted-foreground">No products found</p>
                        </div>
                    )}
                    <div className="flex justify-center gap-1 absolute bottom-4 left-0 right-0">
                        <Button variant="outline" size="icon">
                            <ChevronLeft />
                        </Button>
                        <div className="flex gap-2">
                            {Array.from({ length: paginationTotalPages }).map((_, index) => (
                                <Button key={index} variant="outline" size="icon" className={cn(paginationCurrentPage === index + 1 && "bg-primary text-primary-foreground")}>
                                    {index + 1}
                                </Button>
                            ))}
                        </div>
                        <Button variant="outline" size="icon">
                            <ChevronRight />
                        </Button>
                    </div> */}
                </div>
            </div>
        </section>
    );
}