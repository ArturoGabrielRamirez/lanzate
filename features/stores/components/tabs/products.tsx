import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { ProductsTabProps } from "@/features/stores/types"
import ProductsTable from "../products-table"

async function ProductsTab({ slug, userId }: ProductsTabProps) {

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    return (
        <>
            <ProductsTable data={store.products} userId={userId} slug={slug} storeId={store.id} />
        </>
    )
}
export default ProductsTab