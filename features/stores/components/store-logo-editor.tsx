'use client'

import { Camera } from 'lucide-react'

import { MediaSelector } from '@/features/global/components/media-selector'
import { UPLOAD_TYPES } from '@/features/global/types/media'
import { Button } from '@/features/shadcn/components/ui/button'
import { StoreLogoEditorProps } from '@/features/stores/types'

export function StoreLogoEditor({
  currentLogo,
  storeName,
  storeId,
  onLogoUpdate
}: StoreLogoEditorProps) {

  return (
    <MediaSelector
      type={UPLOAD_TYPES.STORE_LOGO}
      currentUrl={currentLogo}
      onUpdate={onLogoUpdate}
      storeId={storeId}
      triggerButton={
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-0 right-0 rounded-full bg-background border-2 border-background shadow-md hover:bg-accent"
        >
          <Camera className="h-4 w-4" />
        </Button>
      }
      title="Cambiar Logo de Tienda"
      description={`Personaliza el logo de ${storeName}`}
      allowRemove={true}
      loadApiAvatars={false} // No cargar avatares para logos
    />
  )
}