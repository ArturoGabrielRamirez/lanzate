import { Box } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card, CardTitle, CardHeader, CardContent, CardAction } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { CreateProductButton } from "@/features/products/components"
import { ExportProductsButton } from "@/features/products/components"
import { getEmployeePermissions } from "@/features/stores/actions/getEmployeePermissions"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import ProductsTable from "@/features/stores/components/products-table"
import { ProductsTabProps } from "@/features/stores/types"

async function ProductsTab({ slug, userId }: ProductsTabProps) {

    const t = await getTranslations("store.products-tab")

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return null
    }


    // Get user info and employee permissions
    const [
        { payload: store, error: storeError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getStoresFromSlug(slug),
        getEmployeePermissions(user.id, slug)
    ])

    if (userError || !user) {
        return console.log(userMessage)
    }

    if (storeError || !store) {
        return console.log(storeError || t("error-loading-store"))
    }

    if (permissionsError || !employeePermissions) {
        return console.log("Error loading employee permissions")
    }

    const canCreateProducts = employeePermissions.isAdmin || employeePermissions.permissions?.can_create_products

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
    return (
        <Card className="grow !gap-2">
            {/* <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Productos
                </CardTitle>
                <CardAction>
                    <ExportProductsButton data={store.products} onlyIcon />
                    {canCreateProducts && (
                        <CreateProductButton storeId={store.id} userId={user.id} onlyIcon />
                    )}
                </CardAction>
            </CardHeader> */}
            <CardContent className="grow flex flex-col">
                <ProductsTable
                    data={store.products}
                    userId={user.id}
                    slug={slug}
                    storeId={store.id}
                    employeePermissions={employeePermissions}
                    branches={store.branches}
                />
            </CardContent>
        </Card>
    )
}

export default ProductsTab