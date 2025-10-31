import { BackgroundRemover } from "@/features/global/components/background-remover"
import { ImageCropper } from "@/features/global/components/image-cropper"
import CameraComponent from "@/features/global/components/media-selector/camera-component"
import { MediaSelectorDialogsProps } from "@/features/global/types/media"
import { OptimizationDialog } from "@/features/profile/components/optimization-dialog"


export function MediaSelectorDialogs({
  type,
  mediaUpload
}: MediaSelectorDialogsProps) {
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
        type={type}
        maxWidth={mediaUpload.resolvedValidationOptions.maxWidth}
        maxHeight={mediaUpload.resolvedValidationOptions.maxHeight}
      />

      <BackgroundRemover {...mediaUpload.backgroundRemoverProps} />
    </>
  )
}