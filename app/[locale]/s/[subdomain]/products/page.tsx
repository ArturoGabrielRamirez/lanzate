import PageContainer from "@/features/layout/components/page-container"
import ProductCardLoader from "@/features/store-landing/components/product-card-loader"
import ProductList from "@/features/store-landing/components/product-list"
import SidebarCategorySelect from "@/features/store-landing/components/sidebar-category-select"
import SidebarPriceRange from "@/features/store-landing/components/sidebar-price-range"
import SidebarOrderBySelect from "@/features/store-landing/components/sidebar-price-select"
import { loadFilterParams } from "@/features/store-landing/utils/load-filter-params"
import StoreBanner from "@/features/store-layout/components/store-banner"
import TopCategoriesNavbar from "@/features/store-layout/components/top-categories-navbar"
import { SearchParams } from "nuqs"
import { Suspense } from "react"

type Props = {
    params: Promise<{ subdomain: string }>
    searchParams: Promise<SearchParams>
}

const ProductsPage = async ({ params, searchParams }: Props) => {

    const { subdomain } = await params
    const { category, sort, search, min, max, page, limit } = await loadFilterParams(searchParams)
    console.log("🚀 ~ ProductsPage ~ category:", category)

    return (
        <PageContainer className="max-w-full !pt-0">
            <StoreBanner />
            <TopCategoriesNavbar />
            <div className="container mx-auto py-8">
                <div>
                    <SidebarCategorySelect />
                    <SidebarOrderBySelect />
                    <SidebarPriceRange />
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
            </div>
        </PageContainer>
    )
}
export default ProductsPage