'use client'

import { Info } from 'lucide-react'

import { ImagePreview } from '@/features/profile/components/image-preview'
import { OptimizationOptionsList } from '@/features/profile/components/optimization-options-list'
import { RecommendationBanner } from '@/features/profile/components/recommendation-banner'
import { WarningBanner } from '@/features/profile/components/warning-banner'
import { useImageInfo } from '@/features/profile/hooks/use-image-info'
import { OptimizationDialogProps } from '@/features/profile/types'
import { analyzeImageSize } from '@/features/profile/utils/analyze-image-size'
import { getRecommendedSize } from '@/features/profile/utils/get-recommended-size'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/features/shadcn/components/ui/dialog'

function OptimizationDialog({
  isOpen,
  onDecision,
  imageFile,
  onClose,
  type,
  maxWidth = 1920,
  maxHeight = 1080
}: OptimizationDialogProps) {
  const imageInfo = useImageInfo(isOpen, imageFile)
  
  if (!isOpen || !imageFile || !imageInfo) {
    return null
  }

  const recommended = getRecommendedSize(type, maxWidth, maxHeight)
  const { isLargeFile, isMuchLarger } = analyzeImageSize(imageInfo, recommended)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Optimizar Imagen
          </DialogTitle>
          <DialogDescription>
            Tu imagen es más grande que el tamaño recomendado. ¿Cómo te gustaría procesarla?
            <br />
            <span className="text-xs text-muted-foreground">
              También puedes cerrar este diálogo para usar la imagen tal como está.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <ImagePreview
            previewUrl={imageInfo.previewUrl}
            width={imageInfo.width}
            height={imageInfo.height}
            size={imageInfo.size}
            type={type}
          />

          <RecommendationBanner
            type={type}
            recommendedWidth={recommended.width}
            recommendedHeight={recommended.height}
            isLargeFile={isLargeFile}
          />

          <OptimizationOptionsList
            onDecision={onDecision}
            isMuchLarger={isMuchLarger}
            isLargeFile={isLargeFile}
          />

          <WarningBanner isMuchLarger={isMuchLarger} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { OptimizationDialog }