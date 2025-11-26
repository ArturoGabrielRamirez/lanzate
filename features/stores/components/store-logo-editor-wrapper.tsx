"use client"

import { useState } from "react"
import { toast } from "sonner"

import { updateStoreLogoAction } from "@/features/stores/actions"
import { StoreLogoEditor } from "@/features/stores/components"
import { StoreLogoEditorWrapperProps } from "@/features/stores/types"

export function StoreLogoEditorWrapper({
    currentLogo,
    storeName,
    storeId
}: StoreLogoEditorWrapperProps) {
    const [logo, setLogo] = useState<string | null>(currentLogo)

    const handleLogoUpdate = async (newLogoUrl: string | null) => {
        try {
            setLogo(newLogoUrl)

            if (newLogoUrl) {
                const loadingToast = toast.loading('Actualizando logo de la tienda...')

                const result = await updateStoreLogoAction(storeId, newLogoUrl)

                toast.dismiss(loadingToast)

                if (result.hasError) {
                    toast.error(result.message)
                    setLogo(currentLogo)
                } else {
                    toast.success(result.message)
                }
            }
        } catch (error) {
            console.error('Error updating store logo:', error)
            toast.error('Error al actualizar el logo de la tienda')
            setLogo(currentLogo)
        }
    }

    return (
        <StoreLogoEditor
            currentLogo={logo}
            storeName={storeName}
            storeId={storeId}
            onLogoUpdate={handleLogoUpdate}
        />
    )
}