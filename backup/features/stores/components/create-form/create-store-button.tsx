"use client"

import { CreateStoreDialog } from "@/features/stores/components/create-form/create-store-dialog"
import { CreateStoreProvider } from "@/features/stores/components/create-form/create-store-provider"

export function CreateStoreButton({ userId }: { userId: number }) {
    return (
        <CreateStoreProvider>
            <CreateStoreDialog userId={userId} />
        </CreateStoreProvider>
    )
}