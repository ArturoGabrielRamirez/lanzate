/* import { SearchParams } from "nuqs"
import { Suspense } from "react" */

import { PageContainer } from "@/features/layout/components"
import { SidebarOrderBySelect } from "@/features/layout/components/public-store/sidebar-price-select"
/* import { ProductCardLoader, ProductList } from "@/features/products/components" */
/* import { loadFilterParams } from "@/features/products/utils" */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { StoreBanner, TopCategoriesNavbar } from "@/features/stores/components/public"

/* type Props = {
    params: Promise<{ subdomain: string }>
    searchParams: Promise<SearchParams>
} */

async function ProductsPage(/* { params, searchParams }: Props */) {

/*     const { subdomain } = await params
    const { category, sort, search, min, max, page, limit } = await loadFilterParams(searchParams) */

    return (
        <PageContainer className="max-w-full !pt-0">
            <StoreBanner />
            <TopCategoriesNavbar />
            <div className="container mx-auto py-8 md:grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] gap-4">
                <div className="hidden md:flex flex-col gap-4">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="category">
                            <AccordionTrigger>
                                <span className="text-xl font-medium">Categorías</span>
                            </AccordionTrigger>
                            <AccordionContent>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="price">
                            <AccordionTrigger>
                                <span className="text-xl font-medium">Precios</span>
                            </AccordionTrigger>
                            <AccordionContent>
                            </AccordionContent>
                        </AccordionItem>

                        {/* <SidebarCategorySelect /> */}
                        {/* <SidebarPriceRange /> */}
                    </Accordion>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 justify-between">
                        {/* <FiltersIcon /> */}
                        {/* <ProductListDisplay /> */}
                        <SidebarOrderBySelect />
                    </div>
                    {/* <Suspense fallback={<ProductCardLoader />} key={category}> */}
                      {/*   <ProductList
                            subdomain={subdomain}
                            category={category}
                            sort={sort}
                            search={search}
                            min={min}
                            max={max}
                            limit={limit}
                            page={page}
                        /> */}
                  {/*   </Suspense> */}
                </div>
            </div>
        </PageContainer>
    )
}
export default ProductsPage