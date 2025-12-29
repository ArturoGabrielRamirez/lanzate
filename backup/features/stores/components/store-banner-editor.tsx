'use client'

import { Image as ImageIcon } from 'lucide-react'

import { MediaSelector } from '@/features/global/components/media-selector'
import { UPLOAD_TYPES } from '@/features/global/types/media'
import { IconButton } from '@/features/shadcn/components/shadcn-io/icon-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/features/shadcn/components/ui/tooltip'
import { StoreBannerEditorProps } from '@/features/stores/types'

export function StoreBannerEditor({ 
  currentBanner, 
  storeName, 
  storeId,
  onBannerUpdate 
}: StoreBannerEditorProps) {
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <MediaSelector
            type={UPLOAD_TYPES.STORE_BANNER}
            currentUrl={currentBanner}
            onUpdate={onBannerUpdate}
            storeId={storeId}
            triggerButton={
              <IconButton
                size="md"
                icon={ImageIcon}
              />
            }
            title="Cambiar Banner de Tienda"
            description={`Personaliza el banner de ${storeName}`}
            allowRemove={true}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Cambiar banner de la tienda
      </TooltipContent>
    </Tooltip>
  )
}