import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { getEmployeePermissions } from "../../actions/getEmployeePermissions"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { ProductsTabProps } from "@/features/stores/types"
import ProductsTable from "../products-table"
import { getTranslations } from "next-intl/server"

async function ProductsTab({ slug, userId }: ProductsTabProps) {

    const t = await getTranslations("store.products-tab")
    
    // Get user info and employee permissions
    const [
        { payload: user, error: userError, message: userMessage },
        { payload: store, error: storeError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getUserInfo(),
        getStoresFromSlug(slug),
        getEmployeePermissions(userId, slug)
    ])
    console.log("🚀 ~ ProductsTab ~ employeePermissions:", employeePermissions)

    if (userError || !user) {
        return console.log(userMessage)
    }

    if (storeError || !store) {
        return console.log(storeError || t("error-loading-store"))
    }

    if (permissionsError || !employeePermissions) {
        return console.log("Error loading employee permissions")
    }

    return (
        <>
            <ProductsTable 
                data={store.products} 
                userId={userId} 
                slug={slug} 
                storeId={store.id}
                employeePermissions={employeePermissions}
            />
        </>
    )
}

export default ProductsTab