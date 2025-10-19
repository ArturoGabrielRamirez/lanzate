// features/shared/hooks/use-media-upload.ts
'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { AVATAR_OPTIONS, BANNER_OPTIONS } from '@/features/profile/utils/file-validation-client'
import { useFileSelection } from './use-file-selection'
import { useImageCropper } from './use-image-cropper'
import { useBackgroundRemoverModal } from '../components/background-remover/hooks/use-background-remover-modal'
import { useImageOptimization } from './use-image-optimization'
import { useCameraCapture } from './use-camera-capture'
import { useFileUpload } from './use-file-upload'
import { useUploadHistory } from './use-upload-history'
import type { UseMediaUploadOptions, UploadMethod } from '../types'

export function useMediaUpload({
  type,
  onSuccess,
  onError,
  validationOptions,
  autoRevalidate = true
}: UseMediaUploadOptions) {
  const resolvedValidationOptions = validationOptions ||
    (type === 'avatar' ? AVATAR_OPTIONS : BANNER_OPTIONS)

  // Hook de historial
  const uploadHistory = useUploadHistory(type)

  // Hook de cropping
  const cropper = useImageCropper({
    aspectRatio: type === 'avatar' ? 1 : 16 / 9,
    maxWidth: resolvedValidationOptions.maxWidth || 1920,
    maxHeight: resolvedValidationOptions.maxHeight || 1080,
    onCropComplete: (croppedFile) => {
      fileSelection.updateSelectedFile(croppedFile)
    }
  })

  // Hook de optimización
  const optimization = useImageOptimization({
    validationOptions: resolvedValidationOptions,
    onOptimized: (file) => {
      fileSelection.updateSelectedFile(file)
    },
    onNeedsCropping: (file) => {
      cropper.startCropping(file)
    }
  })

  // Hook de selección de archivos
  const fileSelection = useFileSelection({
    validationOptions: resolvedValidationOptions,
    onValidationError: onError,
    onNeedsCropping: (file) => cropper.startCropping(file),
    onNeedsOptimization: (file) => optimization.checkOptimization(file)
  })

  // Hook de upload
  const fileUpload = useFileUpload({
    type,
    onSuccess: (url = '', method = 'file') => {
      // Agregar al historial después de upload exitoso
      if (url && url.includes('user-uploads')) {
        uploadHistory.addUpload(url)
      }
      resetState()
      onSuccess?.(url, method as UploadMethod)
    },
    onError
  })

  // Hook de cámara
  const camera = useCameraCapture({
    type,
    validationOptions: resolvedValidationOptions,
    onCapture: (file) => {
      optimization.checkOptimization(file)
    }
  })

  // Hook de background remover
  const bgRemover = useBackgroundRemoverModal({
    onProcessed: (processedFile) => {
      fileSelection.updateSelectedFile(processedFile)
    }
  })

  /**
   * Obtiene la preview actual (declarada primero para poder usarla en otros callbacks)
   */
  const getCurrentPreview = useCallback(() => {
    return fileSelection.previewUrl || camera.capturedFile?.preview || null
  }, [fileSelection.previewUrl, camera.capturedFile])

  /**
   * Limpia todos los estados
   */
  const resetState = useCallback(() => {
    fileSelection.clearSelection()
    camera.clearCapture()
    cropper.cancelCropping()
    optimization.closeOptimizationDialog()
    bgRemover.closeBackgroundRemover()
  }, [fileSelection, camera, cropper, optimization, bgRemover])

  /**
   * ✅ NUEVO: Abre el cropper manualmente para cualquier imagen
   */
  const openCropper = useCallback(async () => {
    try {
      // Caso 1: Hay archivo seleccionado
      if (fileSelection.selectedFile) {
        cropper.startCropping(fileSelection.selectedFile)
        return
      }

      // Caso 2: Hay foto capturada
      if (camera.capturedFile) {
        cropper.startCropping(camera.capturedFile.file)
        return
      }

      // Caso 3: Solo hay preview (preset o URL de historial)
      const currentPreview = getCurrentPreview()
      if (currentPreview) {
        toast.info('Convirtiendo imagen...')

        // Convertir URL a File
        const response = await fetch(currentPreview)
        if (!response.ok) {
          throw new Error('No se pudo cargar la imagen')
        }

        const blob = await response.blob()
        const file = new File(
          [blob],
          `${type}-to-crop.${blob.type.split('/')[1] || 'jpg'}`,
          { type: blob.type }
        )

        // Actualizar selectedFile y abrir cropper
        fileSelection.updateSelectedFile(file)
        cropper.startCropping(file)
        return
      }

      // Caso 4: No hay nada que recortar
      toast.error('Selecciona una imagen primero')

    } catch (error) {
      console.error('Error opening cropper:', error)
      toast.error('No se pudo abrir el recortador')
    }
  }, [
    fileSelection.selectedFile,
    camera.capturedFile,
    getCurrentPreview,
    cropper.startCropping,
    fileSelection.updateSelectedFile,
    type
  ])

  /**
   * Sube el archivo seleccionado
   */
  const uploadSelectedFile = useCallback(() => {
    const fileToUpload = camera.capturedFile?.file || fileSelection.selectedFile

    if (!fileToUpload) {
      onError?.('No hay archivo seleccionado para subir.')
      return
    }

    // Verificar límite
    if (!uploadHistory.canUploadMore) {
      toast.error(`Has alcanzado el límite de 4 ${type}s. Elimina uno existente para subir uno nuevo.`)
      return
    }

    const method: UploadMethod = camera.capturedFile ? 'camera' : 'file'
    return fileUpload.uploadFile(fileToUpload, method)
  }, [
    fileSelection.selectedFile,
    camera.capturedFile,
    fileUpload.uploadFile,
    onError,
    uploadHistory.canUploadMore,
    type
  ])

  /**
   * Abre el removedor de fondo
   */
  const openBackgroundRemover = useCallback(() => {
    const fileToProcess = fileSelection.selectedFile || camera.capturedFile?.file
    bgRemover.openBackgroundRemover(fileToProcess || null)
  }, [fileSelection.selectedFile, camera.capturedFile, bgRemover])

  // Estados derivados
  const hasSelectedFile = !!(fileSelection.selectedFile || camera.capturedFile)
  const hasPreview = !!getCurrentPreview()
  const isFromCamera = !!camera.capturedFile
  const needsCropping = !!cropper.fileForCropping

  return {
    // Estados principales
    isUploading: fileUpload.isUploading,
    uploadProgress: fileUpload.uploadProgress,
    isLoadingPreset: fileUpload.isLoadingPreset,
    selectedFile: fileSelection.selectedFile,
    capturedFile: camera.capturedFile,
    previewUrl: getCurrentPreview(),
    hasSelectedFile,
    hasPreview,
    isFromCamera,
    needsCropping,

    // Estados de historial
    uploadHistory,

    // Estados de componentes
    isCameraOpen: camera.isCameraOpen,
    isCropperOpen: cropper.isCropperOpen,
    showCropDialog: optimization.showCropDialog,
    showBackgroundRemover: bgRemover.showBackgroundRemover,
    fileForCropping: cropper.fileForCropping,
    pendingFile: optimization.pendingFile,
    pendingFileForBgRemoval: bgRemover.pendingFileForBgRemoval,

    // Métodos de selección
    handleFileSelect: fileSelection.handleFileSelect,
    openFileSelector: fileSelection.openFileSelector,

    // Métodos de cámara
    openCamera: camera.openCamera,
    closeCamera: camera.closeCamera,
    retakePhoto: camera.retakePhoto,

    // Métodos de upload
    uploadSelectedFile,
    usePreset: fileUpload.usePreset,
    cancelUpload: fileUpload.cancelUpload,

    // Métodos de cropping
    openCropper,  // ✅ NUEVO
    handleCropComplete: cropper.handleCropComplete,

    // Métodos de optimización
    handleOptimizationDecision: optimization.handleOptimizationDecision,
    handleOptimizationDialogClose: optimization.closeOptimizationDialog,

    // Métodos de background remover
    openBackgroundRemover,
    handleBackgroundRemoved: bgRemover.handleBackgroundRemoved,

    // Métodos generales
    resetState,
    getCurrentPreview,

    // Props para componentes
    cameraProps: camera.cameraProps,
    fileInputProps: fileSelection.fileInputProps,
    cropperProps: cropper.cropperProps,
    backgroundRemoverProps: bgRemover.backgroundRemoverProps,

    // Configuración
    resolvedValidationOptions
  }
}