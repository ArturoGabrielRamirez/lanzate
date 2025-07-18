import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { CreateProductButton } from "@/features/products/components"
import { ProductsTabProps } from "@/features/stores/types"
import ProductsTable from "../products-table"

async function ProductsTab({ slug }: ProductsTabProps) {

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <CreateProductButton storeId={store.id} />
            </div>
            <ProductsTable data={store.products} />
        </div>
    )
}
export default ProductsTab