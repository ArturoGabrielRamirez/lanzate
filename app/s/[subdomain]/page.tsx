import { Title } from "@/features/layout/components";
import PaginationNav from "@/features/store-landing/components/pagination-nav";
import ProductAmountDisplay from "@/features/store-landing/components/product-amount-display";
import ProductCardLoader from "@/features/store-landing/components/product-card-loader";
import ProductList from "@/features/store-landing/components/product-list";
import ProductListDisplay from "@/features/store-landing/components/product-list-display";
import SidebarFilters from "@/features/store-landing/components/sidebar-filters";
import { loadFilterParams } from "@/features/store-landing/utils/load-filter-params";
import { getStoreProductAmount } from "@/features/subdomain/actions/getStoreProductAmount";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

type Props = {
    params: Promise<{ subdomain: string }>
    searchParams: Promise<SearchParams>
}

export default async function StorePage({ params, searchParams }: Props) {
    const { subdomain } = await params
    const { category, sort, search, min, max, page, limit } = await loadFilterParams(searchParams)

    const { payload: productAmount } = await getStoreProductAmount(subdomain);

    return (
        <section className="p-4 grow flex flex-col">
            <Title title="My Products" />

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-4 grow">
                <SidebarFilters />
                <div className="flex flex-col gap-4 relative">
                    <div className="flex gap-2 justify-between">
                        <ProductListDisplay />
                        <ProductAmountDisplay amount={productAmount || 0} />
                    </div>
                    <Suspense fallback={<ProductCardLoader />} key={category}>
                        <ProductList
                            subdomain={subdomain}
                            category={category}
                            sort={sort}
                            search={search}
                            min={min}
                            max={max}
                            limit={limit}
                            page={page}
                        />
                    </Suspense>
                    <PaginationNav productAmount={productAmount || 0} limit={limit} />
                </div>
            </div>
        </section>
    );
}