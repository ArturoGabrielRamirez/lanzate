import { ArrowRight, BookA, Candy, Eye, Milk, Utensils } from "lucide-react";
import Link from "next/link";
import { SearchParams } from "nuqs";
import { Suspense } from "react";

/* import { Title } from "@/features/layout/components"; */
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/features/layout/components";
/* import PaginationNav from "@/features/store-landing/components/pagination-nav";
import ProductAmountDisplay from "@/features/store-landing/components/product-amount-display"; */
import ProductCardLoader from "@/features/store-landing/components/product-card-loader";
import ProductList from "@/features/store-landing/components/product-list";
/* import ProductListDisplay from "@/features/store-landing/components/product-list-display"; */
/* import SectionContainer from "@/features/store-landing/components/section-container";
import SidebarFilters from "@/features/store-landing/components/sidebar-filters"; */
import { loadFilterParams } from "@/features/store-landing/utils/load-filter-params";
import StoreBanner from "@/features/stores/components/public/store-banner";
import TopCategoriesNavbar from "@/features/stores/components/public/top-categories-navbar";
/* import { getStoreProductAmount } from "@/features/subdomain/actions/getStoreProductAmount"; */
/* import Image from "next/image"; */

type Props = {
    params: Promise<{ subdomain: string }>
    searchParams: Promise<SearchParams>
}

export default async function StorePage({ params, searchParams }: Props) {
    const { subdomain } = await params
    const { category, sort, search, min, max, page, limit } = await loadFilterParams(searchParams)

    /* const { payload: productAmount } = await getStoreProductAmount(subdomain); */
    /* const t = await getTranslations("subdomain"); */

    return (
        <>
            <PageContainer className="max-w-full !pt-0">
                <StoreBanner />
                <TopCategoriesNavbar />
                <div className="container mx-auto py-8 group">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-primary-foreground/50 group-hover:text-primary-foreground transition-all duration-300">
                            Browse by Category
                        </h2>
                        <Link href="/categories" className="flex items-center gap-2 text-sm text-primary-foreground/50 hover:text-primary transition-all duration-300">
                            <ArrowRight className="size-4" />
                            View All
                        </Link>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/products?category=Golosinas" className="w-full">
                            <Card className="w-full rounded-none bg-primary/50 hover:bg-primary transition-all duration-300 hover:rounded-lg hover:scale-105">
                                <CardContent className="grow flex justify-center flex-col items-center">
                                    <Candy className="size-10" />
                                    <p>
                                        Candy
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/products?category=Comida" className="w-full">
                            <Card className="w-full rounded-none bg-primary/50 hover:bg-primary transition-all duration-300 hover:rounded-lg hover:scale-105">
                                <CardContent className="grow flex justify-center flex-col items-center">
                                    <Utensils className="size-10" />
                                    <p>
                                        Food
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/products?category=Bebidas" className="w-full">
                            <Card className="w-full rounded-none bg-primary/50 hover:bg-primary transition-all duration-300 hover:rounded-lg hover:scale-105">
                                <CardContent className="grow flex justify-center flex-col items-center">
                                    <Milk className="size-10" />
                                    <p>
                                        Drinks
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/products?category=library" className="w-full">
                            <Card className="w-full rounded-none bg-primary/50 hover:bg-primary transition-all duration-300 hover:rounded-lg hover:scale-105">
                                <CardContent className="grow flex justify-center flex-col items-center">
                                    <BookA className="size-10" />
                                    <p>
                                        Library
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                        <Link href="/categories" className="w-full">
                            <Card className="w-full rounded-none bg-primary/50 hover:bg-primary transition-all duration-300 hover:rounded-lg hover:scale-105">
                                <CardContent className="grow flex justify-center flex-col items-center">
                                    <Eye className="size-10" />
                                    <p>
                                        View All
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
                {/* <Title title={t("title")} /> */}

                <div className="container mx-auto py-8 group">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-primary-foreground/50 group-hover:text-primary-foreground transition-all duration-300">
                            Best Sellers
                        </h2>
                        <Link href="/products?best-sellers=true" className="flex items-center gap-2 text-sm text-primary-foreground/50 hover:text-primary transition-all duration-300">
                            <ArrowRight className="size-4" />
                            View All
                        </Link>
                    </div>
                    <div className="flex gap-4 grid-rows-[min-content_1fr_min-content] container mx-auto pt-4">
                        {/* <SidebarFilters /> */}
                        <div className="flex flex-col gap-4 relative @container w-full">
                            {/* <div className="flex gap-2 justify-between">
                            <ProductListDisplay />
                            <ProductAmountDisplay amount={productAmount || 0} />
                        </div> */}
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
                            {/* <PaginationNav productAmount={productAmount || 0} limit={limit} /> */}
                        </div>
                    </div>
                </div>
            </PageContainer>
        </>
    );
}