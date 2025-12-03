import { Suspense } from "react"

import { getProductsByStoreAction } from "@/features/products/actions/get-products-by-store.action"
import { ProductsTable } from "@/features/products/components/products-table"
import type { ProductsTableWrapperProps } from "@/features/products/types"
import type { StoreIdentifier } from "@/features/products/types/products-by-store.types"

async function ProductsTableContent({
    storeId,
    slug,
    subdomain,
    userId,
    employeePermissions,
    branches,
    headerActions
}: ProductsTableWrapperProps) {
    // Determine which identifier to use
    let identifier: StoreIdentifier
    let resolvedStoreId = storeId
    
    if (storeId) {
        identifier = { storeId }
        resolvedStoreId = storeId
    } else if (slug) {
        identifier = { slug }
    } else if (subdomain) {
        identifier = { subdomain }
    } else {
        throw new Error("Debe proporcionar storeId, slug o subdomain")
    }

    const { payload: products, hasError, message } = await getProductsByStoreAction(identifier)

    if (hasError || !products) {
        console.error(message || "Error al cargar productos")
        return <div>Error al cargar productos</div>
    }

    // If we don't have storeId, get it from the first product (all products belong to same store)
    if (!resolvedStoreId && products.length > 0) {
        resolvedStoreId = products[0].store_id
    }

    // Determine slug for ProductsTable (needed for links)
    const tableSlug = slug || ""

    return (
        <ProductsTable
            data={products}
            userId={userId}
            slug={tableSlug}
            storeId={resolvedStoreId || 0}
            employeePermissions={employeePermissions}
            branches={branches}
            headerActions={headerActions}
        />
    )
}

export function ProductsTableWrapper(props: ProductsTableWrapperProps) {
    return (
        <Suspense fallback={<div>Cargando productos...</div>}>
            <ProductsTableContent {...props} />
        </Suspense>
    )
}

