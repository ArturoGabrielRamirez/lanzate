'use client'

import { useCallback, useState, useEffect } from 'react'
import { toast } from 'sonner'

import { useBackgroundRemoverModal } from '@/features/global/hooks/media/use-background-remover-modal'
import { useCameraCapture } from '@/features/global/hooks/media/use-camera-capture'
import { useFileSelection } from '@/features/global/hooks/media/use-file-selection'
import { useFileUpload } from '@/features/global/hooks/media/use-file-upload'
import { useImageCropper } from '@/features/global/hooks/media/use-image-cropper'
import { useImageOptimization } from '@/features/global/hooks/media/use-image-optimization'
import { useUploadHistory } from '@/features/global/hooks/media/use-upload-history'
import type { UploadMethod, ValidationOptions, DeferredFile, UseMediaUploadHookOptions } from '@/features/global/types/media'
import { getMediaConfig } from '@/features/global/types/media'
import { getStoragePath } from '@/features/global/utils/media/get-storege-path'

// 🔑 CORRECCIÓN DEL TIIPADO: Omitimos el tipo 'value' incompatible y definimos el correcto.

export function useMediaUpload({
  type,
  onSuccess,
  onError,
  validationOptions,
  deferredMode = false,
  maxFiles = 1,
  onFilesChange,
  value // Recibimos la prop 'value'
}: UseMediaUploadHookOptions) {
  // ✅ Obtener config base del tipo
  const baseConfig = getMediaConfig(type)

  // ✅ Merge: validationOptions tiene prioridad sobre baseConfig
  const config: ValidationOptions = {
    ...baseConfig,
    ...(validationOptions || {}),
    maxFileSize: validationOptions?.maxFileSize || baseConfig.maxSize,
    maxSize: validationOptions?.maxFileSize || baseConfig.maxSize,
  }

  // ✨ Estado para archivos diferidos: Inicializar con la prop 'value'
  const [deferredFiles, setDeferredFiles] = useState<DeferredFile[]>(value || [])
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null)

  // 🔑 EFECTO CLAVE: Sincroniza deferredFiles con la prop 'value'
  useEffect(() => {
    // Utilizamos una comprobación de longitud para evitar la re-renderización excesiva
    if (deferredMode && value && value.length !== deferredFiles.length) {
      setDeferredFiles(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // ====== Hooks base ======
  const uploadHistory = useUploadHistory(
    type === 'store-logo' || type === 'avatar' ? 'avatar' : 'banner'
  )


  const cropper = useImageCropper({
    aspectRatio: config.aspectRatio ?? 1,
    maxWidth: config.maxWidth || 1920,
    maxHeight: config.maxHeight || 1080,
    onCropComplete: (croppedFile) => {
      if (deferredMode && currentEditingId) {
        // Actualizar archivo diferido
        updateDeferredFile(currentEditingId, croppedFile)
        setCurrentEditingId(null)
      } else {
        updateSelectedFile(croppedFile)
      }
    },
  })

  const optimization = useImageOptimization({
    validationOptions: config,
    onOptimized: (file) => {
      if (deferredMode) {
        addDeferredFile(file)
      } else {
        updateSelectedFile(file)
      }
    },
    onNeedsCropping: (file) => {
      if (deferredMode) {
        // Agregar temporalmente y abrir cropper
        const tempId = crypto.randomUUID()
        const preview = URL.createObjectURL(file)
        const tempFile: DeferredFile = {
          id: tempId,
          file,
          preview,
          isPrimary: deferredFiles.length === 0
        }
        setDeferredFiles(prev => [...prev, tempFile])
        setCurrentEditingId(tempId)
        startCropping(file)
      } else {
        startCropping(file)
      }
    },
  })

  const fileSelection = useFileSelection({
    validationOptions: config,
    onValidationError: onError,
    onNeedsCropping: (file) => optimization.checkOptimization(file),
    onNeedsOptimization: (file) => optimization.checkOptimization(file),
  })

  const fileUpload = useFileUpload({
    type,
    onSuccess: (url = '', method = 'file') => {
      // ✅ MODIFICADO: Detección dinámica del bucket
      const { bucket } = getStoragePath(type)

      // Verificamos si la URL contiene el bucket actual para agregarlo al historial
      if (url && url.includes(bucket)) {
        uploadHistory.addUpload(url)
      }

      resetState()
      onSuccess?.(url, method as UploadMethod)
    },
    onError,
  })
  const camera = useCameraCapture({
    type,
    validationOptions: config,
    onCapture: (file) => optimization.checkOptimization(file),
  })

  const bgRemover = useBackgroundRemoverModal({
    onProcessed: (processedFile) => {
      if (deferredMode && currentEditingId) {
        updateDeferredFile(currentEditingId, processedFile)
      } else {
        updateSelectedFile(processedFile)
      }
    },
  })

  // ====== Desestructuración ======
  const {
    selectedFile,
    updateSelectedFile,
    handleFileSelect: originalHandleFileSelect,
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

  // ✨ NUEVO: Funciones para modo diferido
  const addDeferredFile = useCallback((file: File) => {
    if (deferredFiles.length >= maxFiles) {
      toast.error(`Máximo ${maxFiles} imágenes permitidas`)
      return
    }

    const id = crypto.randomUUID()
    const preview = URL.createObjectURL(file)
    const newFile: DeferredFile = {
      id,
      file,
      preview,
      isPrimary: deferredFiles.length === 0
    }

    const updated = [...deferredFiles, newFile]
    setDeferredFiles(updated)
    onFilesChange?.(updated)
  }, [deferredFiles, maxFiles, onFilesChange])

  const updateDeferredFile = useCallback((id: string, newFile: File) => {
    setDeferredFiles(prev => {
      const updated = prev.map(df => {
        if (df.id === id) {
          URL.revokeObjectURL(df.preview)
          return {
            ...df,
            file: newFile,
            preview: URL.createObjectURL(newFile)
          }
        }
        return df
      })
      onFilesChange?.(updated)
      return updated
    })
  }, [onFilesChange])

  const removeDeferredFile = useCallback((id: string) => {
    setDeferredFiles(prev => {
      const removed = prev.find(f => f.id === id)
      if (removed) URL.revokeObjectURL(removed.preview)

      const filtered = prev.filter(f => f.id !== id)

      // Ajustar primaria si es necesario
      if (removed?.isPrimary && filtered.length > 0) {
        filtered[0].isPrimary = true
      }

      onFilesChange?.(filtered)
      return filtered
    })
  }, [onFilesChange])

  const setPrimaryDeferredFile = useCallback((id: string) => {
    setDeferredFiles(prev => {
      const updated = prev.map(f => ({
        ...f,
        isPrimary: f.id === id
      }))
      onFilesChange?.(updated)
      return updated
    })
  }, [onFilesChange])

  const openCropperForFile = useCallback((id: string) => {
    const file = deferredFiles.find(f => f.id === id)
    if (file) {
      setCurrentEditingId(id)
      startCropping(file.file)
    }
  }, [deferredFiles, startCropping])

  // ✨ NUEVO: Función para subir todos los archivos diferidos
  const uploadDeferredFiles = useCallback(async (productId: number) => {
    const results = await Promise.all(
      deferredFiles.map(async (df, index) => {
        const formData = new FormData()
        formData.append('file', df.file)
        formData.append('type', type)
        formData.append('productId', productId.toString())
        formData.append('isPrimary', df.isPrimary.toString())
        formData.append('sortOrder', index.toString())

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) throw new Error(`Error uploading ${df.file.name}`)
        const data = await response.json()
        return data.url
      })
    )

    return results
  }, [deferredFiles, type])

  // ✨ Modificar handleFileSelect para soportar modo diferido
  const handleFileSelect = useCallback(async (file: File) => {
    if (deferredMode) {
      // No subir, solo agregar a la lista después de validación
      const isValid = await originalHandleFileSelect(file)
      if (isValid && !showCropDialog) {
        addDeferredFile(file)
      }
      return isValid
    } else {
      // Comportamiento original (subir inmediatamente)
      return originalHandleFileSelect(file)
    }
  }, [deferredMode, originalHandleFileSelect, addDeferredFile, showCropDialog])

  // ====== Utilidades ======
  const getCurrentPreview = useCallback(() => {
    if (deferredMode && deferredFiles.length > 0) {
      return deferredFiles.find(f => f.isPrimary)?.preview || deferredFiles[0]?.preview || null
    }
    return previewUrl || capturedFile?.preview || null
  }, [deferredMode, deferredFiles, previewUrl, capturedFile])

  const resetState = useCallback(() => {
    clearSelection()
    clearCapture()
    cancelCropping()
    closeOptimizationDialog()
    closeBackgroundRemover()

    // Limpiar archivos diferidos
    if (deferredMode) {
      deferredFiles.forEach(f => URL.revokeObjectURL(f.preview))
      setDeferredFiles([])
      setCurrentEditingId(null)
    }
  }, [
    clearSelection,
    clearCapture,
    cancelCropping,
    closeOptimizationDialog,
    closeBackgroundRemover,
    deferredMode,
    deferredFiles
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
  const hasSelectedFile = !!(selectedFile || capturedFile || (deferredMode && deferredFiles.length > 0))
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
    resolvedValidationOptions: config,

    // ✨ Modo diferido
    deferredMode,
    deferredFiles,
    addDeferredFile,
    removeDeferredFile,
    setPrimaryDeferredFile,
    openCropperForFile,
    uploadDeferredFiles,
    canAddMoreFiles: deferredFiles.length < maxFiles
  }
}