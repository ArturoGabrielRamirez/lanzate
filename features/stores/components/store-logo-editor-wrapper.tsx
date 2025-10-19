"use client"

import { useState } from "react"
import { toast } from "sonner"

import { updateStoreLogoAction } from "@/features/stores/actions"
import { StoreLogoEditor } from "@/features/stores/components"

type StoreLogoEditorWrapperProps = {
    currentLogo: string | null
    storeName: string
    storeId: number
}

function StoreLogoEditorWrapper({ currentLogo, storeName, storeId }: StoreLogoEditorWrapperProps) {
    const [logo, setLogo] = useState<string | null>(currentLogo)

    const handleLogoUpdate = async (newLogoUrl: string | null) => {
        try {
            // Update local state
            setLogo(newLogoUrl)

            // Update in database
            if (newLogoUrl) {
                toast.loading('Updating store logo...')
                const { hasError, message } = await updateStoreLogoAction(storeId, newLogoUrl)
                if (hasError) {
                    toast.dismiss()
                    toast.error(message)
                } else {
                    toast.dismiss()
                    toast.success(message)
                }
            }
        } catch (error) {
            console.error('Error updating store logo:', error)
            toast.error('Error updating store logo')
        }
    }

    return (
        <StoreLogoEditor
            currentLogo={logo}
            storeName={storeName}
            onLogoUpdate={handleLogoUpdate}
        />
    )
}

export { StoreLogoEditorWrapper }
