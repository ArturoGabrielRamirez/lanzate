import { BackgroundRemover } from "@/features/global/components/background-remover"
import { ImageCropper } from "@/features/global/components/image-cropper"
import CameraComponent from "@/features/global/components/media-selector/camera-component"
import { MediaSelectorDialogsProps } from "@/features/global/types/media"
import { OptimizationDialog } from "@/features/profile/components/optimization-dialog"


export function MediaSelectorDialogs({
  type,
  mediaUpload
}: MediaSelectorDialogsProps) {

  const optimizationType: 'avatar' | 'banner' | 'store-logo' | 'store-banner' | "product-image" | "product-video" =
    type === 'store-logo' ? 'avatar' : (type as 'avatar' | 'banner') //TODO: Verificar si esto es correcto para product-image y product-video
  return (
    <>
      <CameraComponent {...mediaUpload.cameraProps} />

      {mediaUpload.isCropperOpen && (
        <ImageCropper {...mediaUpload.cropperProps} />
      )}

      <OptimizationDialog
        isOpen={mediaUpload.showCropDialog}
        onDecision={mediaUpload.handleOptimizationDecision}
        onClose={mediaUpload.handleOptimizationDialogClose}
        imageFile={mediaUpload.pendingFile}
        type={optimizationType}
        maxWidth={mediaUpload.resolvedValidationOptions.maxWidth}
        maxHeight={mediaUpload.resolvedValidationOptions.maxHeight}
      />

      <BackgroundRemover {...mediaUpload.backgroundRemoverProps} />
    </>
  )
}