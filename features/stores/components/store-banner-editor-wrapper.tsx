"use client"

import { useState } from "react"
import { toast } from "sonner"

import { CardAction } from "@/features/shadcn/components/ui/card"
import { updateStoreBannerAction } from "@/features/stores/actions"
import { StoreBannerEditor } from "@/features/stores/components"
import { StoreBannerEditorWrapperProps } from "@/features/stores/types"

export function StoreBannerEditorWrapper({ 
  currentBanner, 
  storeName, 
  storeId 
}: StoreBannerEditorWrapperProps) {
  const [banner, setBanner] = useState<string | null>(currentBanner)

  const handleBannerUpdate = async (newBannerUrl: string | null) => {
    try {
      setBanner(newBannerUrl)
      
      if (newBannerUrl) {
        const loadingToast = toast.loading('Actualizando banner de la tienda...')
        
        const result = await updateStoreBannerAction(storeId, newBannerUrl)
        
        toast.dismiss(loadingToast)
        
        if (result.hasError) {
          toast.error(result.message)
          setBanner(currentBanner)
        } else {
          toast.success(result.message)
        }
      }
    } catch (error) {
      console.error('Error updating store banner:', error)
      toast.error('Error al actualizar el banner de la tienda')
      setBanner(currentBanner)
    }
  }

  return (
    <CardAction className="group-hover/store-banner:opacity-100 opacity-0 transition-opacity duration-300">
      <StoreBannerEditor
        currentBanner={banner}
        storeName={storeName}
        storeId={storeId}
        onBannerUpdate={handleBannerUpdate}
      />
    </CardAction>
  )
}
