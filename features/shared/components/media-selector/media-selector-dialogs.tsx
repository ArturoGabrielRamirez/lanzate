import CameraComponent from "@/features/shared/components/media-selector/camera-component"
import { ImageCropper } from "../image-cropper"
import { OptimizationDialog } from "@/features/profile/components/optimization-dialog"
import { BackgroundRemover } from "../background-remover"
import { MediaSelectorDialogsProps } from "../types"


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