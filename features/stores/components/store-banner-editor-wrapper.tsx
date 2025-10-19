"use client"

import { useState } from "react"
import { toast } from "sonner"

import { CardAction } from "@/components/ui/card"
import { updateStoreBannerAction } from "@/features/stores/actions"
import { StoreBannerEditor } from "@/features/stores/components"
import { StoreBannerEditorWrapperProps } from "@/features/stores/types"

function StoreBannerEditorWrapper({ currentBanner, storeName, storeId }: StoreBannerEditorWrapperProps) {
    const [banner, setBanner] = useState<string | null>(currentBanner)

    const handleBannerUpdate = async (newBannerUrl: string | null) => {
        try {
            setBanner(newBannerUrl)
            if (newBannerUrl) {
                toast.loading('Updating store banner...')
                const { hasError, message } = await updateStoreBannerAction(storeId, newBannerUrl)
                if (hasError) {
                    toast.dismiss()
                    toast.error(message)
                } else {
                    toast.dismiss()
                    toast.success(message)
                }
            }
        } catch (error) {
            console.error('Error updating store banner:', error)
            toast.error('Error updating store banner')
        }
    }

    return (
        <CardAction className="group-hover/store-banner:opacity-100 opacity-0 transition-opacity duration-300">
            <StoreBannerEditor
                currentBanner={banner}
                storeName={storeName}
                onBannerUpdate={handleBannerUpdate}
            />
        </CardAction>
    )
}

export { StoreBannerEditorWrapper }
