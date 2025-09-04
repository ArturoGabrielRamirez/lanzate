import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { getEmployeePermissions } from "../../actions/getEmployeePermissions"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { ProductsTabProps } from "@/features/stores/types"
import ProductsTable from "../products-table"
import { getTranslations } from "next-intl/server"
import { Card, CardTitle, CardHeader, CardContent, CardAction } from "@/components/ui/card"
import { Box } from "lucide-react"
import { CreateProductButton } from "@/features/products/components"
import { ExportProductsButton } from "@/features/products/components"
import CreateProductButtonNew from "@/features/products/components/create-product-button-new"

async function ProductsTab({ slug, userId }: ProductsTabProps) {

    const t = await getTranslations("store.products-tab")

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.log(userMessage)
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
        <Card className="grow !gap-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Box className="w-4 h-4" />
                    Productos
                </CardTitle>
                <CardAction>
                    <ExportProductsButton data={store.products} onlyIcon />
                    {canCreateProducts && (
                        <CreateProductButtonNew />
                    )}
                </CardAction>
            </CardHeader>
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