'use client'

import { Trash2 } from 'lucide-react'

import { ConfirmDialog } from '@/features/global/components/media-selector/confirm-dialog'
import { AvatarLayout, BannerLayout } from '@/features/global/components/media-selector/index'
import { UploadProgress } from '@/features/global/components/upload-progress'
import { useConfirm } from '@/features/global/hooks/use-confirm'
import { MediaSelectorContentProps } from '@/features/global/types/media'
import { Button } from '@/features/shadcn/components/ui/button'


export function MediaSelectorContent({
  type,
  previewUrl,
  currentUrl,
  allOptions,
  mediaOptions,
  mediaUpload,
  allowRemove,
  isActionDisabled,
  showUploadButton,
  onRemove,
  onCancel
}: MediaSelectorContentProps) {
  const confirm = useConfirm()

  const uploadLimitReached = !mediaUpload.uploadHistory.canUploadMore
  const uploadsCount = mediaUpload.uploadHistory.uploads.length
  const myFiles = mediaUpload.uploadHistory.uploads.map((url: string, i: number) => ({
    id: `upload-${i}`,
    url,
    name: `Upload ${i + 1}`
  }))

  const handleClearPreview = () => {
    mediaUpload.resetState()
  }

  const handleRemoveFromServer = async () => {
    const confirmed = await confirm.confirm()
    if (confirmed) {
      onRemove()
    }
  }

  // Handler unificado para todas las herramientas
  const handleToolClick = async (tool: string) => {
    switch (tool) {
      case 'upload':
        mediaUpload.openFileSelector()
        break
      case 'camera':
        mediaUpload.openCamera()
        break
      case 'crop':
        if (previewUrl) {
          await mediaUpload.openCropper()
        } else {
          mediaUpload.openFileSelector()
        }
        break
      case 'removeBg':
        if (previewUrl) {
          mediaUpload.openBackgroundRemover()
        } else {
          mediaUpload.openFileSelector()
        }
        break
    }
  }

  const showLoader = mediaUpload.isUploading || mediaUpload.uploadProgress > 0 || mediaUpload.isLoadingPreset
  const isGalleryLoading = mediaOptions.isLoadingAvatars || mediaOptions.isLoadingBanners
  const galleryError = type === 'avatar' ? mediaOptions.avatarLoadError : mediaOptions.bannerLoadError

  // Props comunes para ambos layouts
  const layoutProps = {
    previewUrl,
    showUploadButton,
    uploadLimitReached,
    isActionDisabled,
    uploadsCount,
    myFiles,
    allOptions,
    isGalleryLoading,
    galleryError,
    mediaUpload,
    mediaOptions,
    onToolClick: handleToolClick,
    onClearPreview: handleClearPreview
  }

  return (
    <>
      <div className="space-y-4">
        {/* Upload Progress */}
        {showLoader && (
          <UploadProgress
            progress={mediaUpload.uploadProgress}
            isUploading={mediaUpload.isUploading}
            fileName={
              mediaUpload.selectedFile?.name ||
              mediaUpload.capturedFile?.file.name
            }
            fileSize={
              mediaUpload.selectedFile?.size
                ? `${(mediaUpload.selectedFile.size / 1024 / 1024).toFixed(1)} MB`
                : undefined
            }
            onCancel={mediaUpload.cancelUpload}
            success={
              mediaUpload.uploadProgress === 100 && !mediaUpload.isUploading
            }
          />
        )}

        {/* Layout dinámico según tipo */}
        {type === 'avatar' ? (
          <AvatarLayout {...layoutProps} />
        ) : (
          <BannerLayout {...layoutProps} />
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          {allowRemove && currentUrl && (
            <Button
              variant="outline"
              onClick={handleRemoveFromServer}
              disabled={isActionDisabled}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          )}

          <div className={`flex gap-2 ${!allowRemove || !currentUrl ? 'ml-auto' : ''}`}>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isActionDisabled}
            >
              Cancelar
            </Button>
            {showUploadButton && (
              <Button
                onClick={mediaUpload.uploadSelectedFile}
                disabled={isActionDisabled || uploadLimitReached}
              >
                {mediaUpload.isFromCamera ? 'Usar Foto' : 'Subir Archivo'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirm.isOpen}
        onOpenChange={(open: boolean) => !open && confirm.handleCancel()}
        title={`¿Eliminar ${type}?`}
        description={`Esta acción eliminará tu ${type} actual del servidor. Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirm.handleConfirm}
        variant="destructive"
      />
    </>
  )
}