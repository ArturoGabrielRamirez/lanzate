'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Info } from 'lucide-react'
import { OptimizationDialogProps } from '../types'
import { useImageInfo } from '../hooks/use-image-info'
import { getRecommendedSize, analyzeImageSize } from '../utils/image-calculations'
import { ImagePreview } from './image-preview'
import { RecommendationBanner } from './recommendation-banner'
import { OptimizationOptionsList } from './optimization-options-list'
import { WarningBanner } from './warning-banner'

export function OptimizationDialog({
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