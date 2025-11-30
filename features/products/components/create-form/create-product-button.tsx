"use client"

import { CreateProductDialog } from "@/features/products/components/create-form/create-product-dialog"
import { CreateProductProvider } from "@/features/products/components/create-form/create-product-provider"

export function CreateProductButton({ userId, storeId }: { userId: number; storeId?: number }) {
    return (
        <CreateProductProvider>
            <CreateProductDialog userId={userId} storeId={storeId} />
        </CreateProductProvider>
    )
}

