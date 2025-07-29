import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { ProductsTabProps } from "@/features/stores/types"
import ProductsTable from "../products-table"
import { getTranslations } from "next-intl/server"

async function ProductsTab({ slug, userId }: ProductsTabProps) {

    const { payload: store, error } = await getStoresFromSlug(slug)
    const t = await getTranslations("store.products-tab")

    if (error || !store) {
        return console.log(error || t("error-loading-store"))
    }

    return (
        <>
            <ProductsTable data={store.products} userId={userId} slug={slug} storeId={store.id} />
        </>
    )
}
export default ProductsTab