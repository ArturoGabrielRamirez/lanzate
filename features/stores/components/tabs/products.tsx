import { getTranslations } from "next-intl/server"

import { getEmployeePermissionsAction } from "@/features/employees/actions/get-employee-permisions.action"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
/* import { CreateProductButton } from "@/features/products/components" */
import { CreateProductButton } from "@/features/products/components/create-form/create-product-button"
import { ProductsTable } from "@/features/products/components/products-table"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"
import { ProductsTabProps } from "@/features/stores/types"

async function ProductsTab({ slug }: ProductsTabProps) {
    const t = await getTranslations("store.products-tab")

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    // Get store info and employee permissions
    const [
        { payload: store, hasError: storeError, message: storeMessage },
        { payload: employeePermissions, hasError: permissionsError }
    ] = await Promise.all([
        getStoresFromSlugAction(slug),
        getEmployeePermissionsAction(user.id, slug)
    ])

    if (storeError || !store) {
        console.error(storeMessage || t("error-loading-store"))
        return null
    }

    if (permissionsError || !employeePermissions) {
        console.error("Error al cargar los permisos del empleado")
        return null
    }

    return (
        <ProductsTable
            data={store.products}
            userId={user.id}
            slug={slug}
            storeId={store.id}
            employeePermissions={employeePermissions}
            branches={store.branches}
            /* headerActions={
                <CreateProductButton
                    storeId={store.id}
                    userId={user.id}
                />
            } */
            headerActions={
                <CreateProductButton
                    storeId={store.id}
                    userId={user.id}
                />
            }
        />
    )
}

export default ProductsTab