import { getStoresFromSlug } from "../../actions/getStoresFromSlug"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateProductButton } from "@/features/products/components"
import { ProductCard } from "@/features/stores/components"

import { Plus } from "lucide-react"

import { ProductsTabProps } from "@/features/stores/types"
import ProductsTable from "../products-table"

async function ProductsTab({ slug }: ProductsTabProps) {

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    return (
        <div /* className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4 w-full" */>
            {/* <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="size-4" />
                        <h3 className="font-bold text-sm">New Product</h3>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center grow">
                    <CreateProductButton storeId={store.id} />
                </CardContent>
            </Card> */}
            {/* {store.products.map((product) => (
                <ProductCard key={product.id} product={product} slug={slug} />
            ))} */}
            <ProductsTable data={store.products} />
        </div>
    )
}
export default ProductsTab