import { getTranslations } from "next-intl/server"

import { getEmployeePermissionsAction } from "@/features/employees/actions/get-employee-permisions.action"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { ProductsTable } from "@/features/products/components/products-table"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"
import { ProductsTabProps } from "@/features/stores/types"

async function ProductsTab({ slug }: ProductsTabProps) {

    const t = await getTranslations("store.products-tab")

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return null
    }


    // Get user info and employee permissions
    const [
        { payload: store, hasError: storeError },
        { payload: employeePermissions, hasError: permissionsError }
    ] = await Promise.all([
        getStoresFromSlugAction(slug),
        getEmployeePermissionsAction(user.id, slug)
    ])

    if (userError || !user) {
        return console.log(userMessage)
    }

    if (storeError || !store) {
        return console.log(storeError || t("error-loading-store"))
    }

    if (permissionsError || !employeePermissions) {
        return console.log("Error al cargar los permisos del empleado")
    }

    return (
        <ProductsTable
            data={store.products}
            userId={user.id}
            slug={slug}
            storeId={store.id}
            employeePermissions={employeePermissions}
            branches={store.branches}
        />
    )
}

export default ProductsTab