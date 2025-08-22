import { Title } from "@/features/layout/components";
import PageContainer from "@/features/layout/components/page-container";
import PaginationNav from "@/features/store-landing/components/pagination-nav";
import ProductAmountDisplay from "@/features/store-landing/components/product-amount-display";
import ProductCardLoader from "@/features/store-landing/components/product-card-loader";
import ProductList from "@/features/store-landing/components/product-list";
import ProductListDisplay from "@/features/store-landing/components/product-list-display";
import SectionContainer from "@/features/store-landing/components/section-container";
import SidebarFilters from "@/features/store-landing/components/sidebar-filters";
import { loadFilterParams } from "@/features/store-landing/utils/load-filter-params";
import { getStoreProductAmount } from "@/features/subdomain/actions/getStoreProductAmount";
import { getTranslations } from "next-intl/server";
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
    const t = await getTranslations("subdomain");

    return (
        <PageContainer className="![padding-top:calc(var(--section-padding-top)_+_2rem)]">
            <Title title={t("title")} />

            <div className="flex gap-4 grow grid-rows-[min-content_1fr_min-content]">
                <SidebarFilters />
                <div className="flex flex-col gap-4 relative @container w-full">
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
        </PageContainer>
    );
}