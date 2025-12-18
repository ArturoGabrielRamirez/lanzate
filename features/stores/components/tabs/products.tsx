import { getTranslations } from "next-intl/server"
import { SearchParams } from "nuqs"
import { Suspense } from "react"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { CreateProductButton } from "@/features/products/components/create-form/create-product-button"
import { ProductsTableWrapper } from "@/features/products/components/products-table-wrapper"
import { getStoreBasicInfoBySlugAction } from "@/features/stores/actions/get-store-basic-info-by-slug.action"
import { ProductsTabProps } from "@/features/stores/types"

async function ProductsTabContent({ slug, userId, ...queryParams }: ProductsTabProps & { userId: number } & { queryParams: Promise<SearchParams> }) {
    const { payload: storeInfo, hasError: storeError, message: storeMessage } = await getStoreBasicInfoBySlugAction(slug)

    if (storeError || !storeInfo) {
        console.error(storeMessage || "Error al cargar información de la tienda")
        return null
    }

    // Default employee permissions - assuming user is admin/owner for now
    // This can be enhanced later if needed
    const employeePermissions = {
        isAdmin: true,
        permissions: {
            can_create_orders: true,
            can_update_orders: true,
            can_create_products: true,
            can_update_products: true,
            can_manage_stock: true,
            can_process_refunds: true,
            can_view_reports: true,
            can_manage_employees: true,
            can_manage_store: true
        }
    }

    return (
        <ProductsTableWrapper
            slug={slug}
            storeId={storeInfo.id}
            userId={userId}
            employeePermissions={employeePermissions}
            branches={storeInfo.branches}
            {...queryParams}
            headerActions={
                <CreateProductButton
                    storeId={storeInfo.id}
                    userId={userId}
                />
            }
        />
    )
}

async function ProductsTab({ slug, ...queryParams }: ProductsTabProps & { queryParams: Promise<SearchParams> }) {
    const t = await getTranslations("store.products-tab")

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    return (
        <Suspense fallback={<div>{t("loading-products") || "Cargando productos..."}</div>}>
            <ProductsTabContent slug={slug} {...queryParams} userId={user.id} />
        </Suspense>
    )
}

export default ProductsTab