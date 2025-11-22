'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'

import { useBackgroundRemoverModal } from '@/features/global/hooks/media/use-background-remover-modal'
import { useCameraCapture } from '@/features/global/hooks/media/use-camera-capture'
import { useFileSelection } from '@/features/global/hooks/media/use-file-selection'
import { useFileUpload } from '@/features/global/hooks/media/use-file-upload'
import { useImageCropper } from '@/features/global/hooks/media/use-image-cropper'
import { useImageOptimization } from '@/features/global/hooks/media/use-image-optimization'
import { useUploadHistory } from '@/features/global/hooks/media/use-upload-history'
import type { UseMediaUploadOptions, UploadMethod } from '@/features/global/types/media'
import { AVATAR_OPTIONS, BANNER_OPTIONS } from '@/features/profile/constants'

export function useMediaUpload({
  type,
  onSuccess,
  onError,
  validationOptions,
}: UseMediaUploadOptions) {
  const resolvedValidationOptions =
    validationOptions || (type === 'avatar' ? AVATAR_OPTIONS : BANNER_OPTIONS)

  // ====== Hooks base ======
  const uploadHistory = useUploadHistory(type)

  const cropper = useImageCropper({
    aspectRatio: type === 'avatar' ? 1 : 16 / 9,
    maxWidth: resolvedValidationOptions.maxWidth || 1920,
    maxHeight: resolvedValidationOptions.maxHeight || 1080,
    onCropComplete: (croppedFile) => updateSelectedFile(croppedFile),
  })

  const optimization = useImageOptimization({
    validationOptions: resolvedValidationOptions,
    onOptimized: (file) => updateSelectedFile(file),
    onNeedsCropping: (file) => startCropping(file),
  })

  const fileSelection = useFileSelection({
    validationOptions: resolvedValidationOptions,
    onValidationError: onError,
    onNeedsCropping: (file) => startCropping(file),
    onNeedsOptimization: (file) => checkOptimization(file),
  })

  const fileUpload = useFileUpload({
    type,
    onSuccess: (url = '', method = 'file') => {
      if (url && url.includes('user-uploads')) {
        uploadHistory.addUpload(url)
      }
      resetState()
      onSuccess?.(url, method as UploadMethod)
    },
    onError,
  })

  const camera = useCameraCapture({
    type,
    validationOptions: resolvedValidationOptions,
    onCapture: (file) => checkOptimization(file),
  })

  const bgRemover = useBackgroundRemoverModal({
    onProcessed: (processedFile) => updateSelectedFile(processedFile),
  })

  // ====== Desestructuración (para dependencias estables) ======
  const {
    selectedFile,
    updateSelectedFile,
    handleFileSelect,
    openFileSelector,
    clearSelection,
    previewUrl,
    fileInputProps,
  } = fileSelection

  const {
    uploadFile,
    usePreset,
    cancelUpload,
    isUploading,
    uploadProgress,
    isLoadingPreset,
  } = fileUpload

  const {
    startCropping,
    cancelCropping,
    handleCropComplete,
    fileForCropping,
    isCropperOpen,
    cropperProps,
  } = cropper

  const {
    checkOptimization,
    closeOptimizationDialog,
    handleOptimizationDecision,
    showCropDialog,
    pendingFile,
  } = optimization

  const {
    openBackgroundRemover,
    handleBackgroundRemoved,
    backgroundRemoverProps,
    showBackgroundRemover,
    pendingFileForBgRemoval,
    closeBackgroundRemover,
  } = bgRemover

  const {
    openCamera,
    closeCamera,
    retakePhoto,
    cameraProps,
    capturedFile,
    isCameraOpen,
    clearCapture,
  } = camera

  // ====== Utilidades ======
  const getCurrentPreview = useCallback(() => {
    return previewUrl || capturedFile?.preview || null
  }, [previewUrl, capturedFile])

  const resetState = useCallback(() => {
    clearSelection()
    clearCapture()
    cancelCropping()
    closeOptimizationDialog()
    closeBackgroundRemover()
  }, [
    clearSelection,
    clearCapture,
    cancelCropping,
    closeOptimizationDialog,
    closeBackgroundRemover,
  ])

  // ====== Cropper manual ======
  const openCropper = useCallback(async () => {
    try {
      if (selectedFile) {
        startCropping(selectedFile)
        return
      }

      if (capturedFile) {
        startCropping(capturedFile.file)
        return
      }

      const currentPreview = getCurrentPreview()
      if (currentPreview) {
        toast.info('Convirtiendo imagen...')

        const response = await fetch(currentPreview)
        if (!response.ok) throw new Error('No se pudo cargar la imagen')

        const blob = await response.blob()
        const file = new File(
          [blob],
          `${type}-to-crop.${blob.type.split('/')[1] || 'jpg'}`,
          { type: blob.type }
        )

        updateSelectedFile(file)
        startCropping(file)
        return
      }

      toast.error('Primero seleccioná una imagen para recortar.')
    } catch (error) {
      console.error('Error opening cropper:', error)
      toast.error('No se pudo abrir el recortador')
    }
  }, [selectedFile, capturedFile, getCurrentPreview, startCropping, updateSelectedFile, type])

  // ====== Upload ======
  const uploadSelectedFile = useCallback(() => {
    const fileToUpload = capturedFile?.file || selectedFile

    if (!fileToUpload) {
      onError?.('No hay archivo seleccionado para subir.')
      return
    }

    if (!uploadHistory.canUploadMore) {
      toast.error(`Alcanzaste el límite de 4 ${type}s. Elimina uno existente para subir uno nuevo o actualiza tu plan para subir más.`)
      return
    }

    const method: UploadMethod = capturedFile ? 'camera' : 'file'
    return uploadFile(fileToUpload, method)
  }, [capturedFile, selectedFile, uploadFile, onError, uploadHistory.canUploadMore, type])

  // ====== Background remover ======
  const openBackgroundRemoverHandler = useCallback(() => {
    const fileToProcess = selectedFile || capturedFile?.file
    openBackgroundRemover(fileToProcess || null)
  }, [selectedFile, capturedFile, openBackgroundRemover])

  // ====== Estados derivados ======
  const hasSelectedFile = !!(selectedFile || capturedFile)
  const hasPreview = !!getCurrentPreview()
  const isFromCamera = !!capturedFile
  const needsCropping = !!fileForCropping

  // ====== Retorno ======
  return {
    // Estados principales
    isUploading,
    uploadProgress,
    isLoadingPreset,
    selectedFile,
    capturedFile,
    previewUrl: getCurrentPreview(),
    hasSelectedFile,
    hasPreview,
    isFromCamera,
    needsCropping,

    // Historial
    uploadHistory,

    // Componentes
    isCameraOpen,
    isCropperOpen,
    showCropDialog,
    showBackgroundRemover,
    fileForCropping,
    pendingFile,
    pendingFileForBgRemoval,

    // Métodos principales
    uploadSelectedFile,
    usePreset,
    cancelUpload,

    // Selección de archivos
    handleFileSelect,
    openFileSelector,

    // Cámara
    openCamera,
    closeCamera,
    retakePhoto,

    // Cropper
    openCropper,
    handleCropComplete,

    // Optimización
    handleOptimizationDecision,
    handleOptimizationDialogClose: closeOptimizationDialog,

    // Background remover
    openBackgroundRemover: openBackgroundRemoverHandler,
    handleBackgroundRemoved,

    // Generales
    resetState,
    getCurrentPreview,

    // Props
    cameraProps,
    fileInputProps,
    cropperProps,
    backgroundRemoverProps,

    // Configuración
    resolvedValidationOptions,
  }
}
