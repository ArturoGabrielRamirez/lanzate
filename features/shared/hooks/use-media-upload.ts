'use client'

import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'

import { AVATAR_OPTIONS, BANNER_OPTIONS, fileValidation, FileValidationOptions } from '@/features/profile/utils/file-validation-client'
import { useUserActions } from '@/features/profile/context/user-constext'

export type MediaType = 'avatar' | 'banner'
export type UploadMethod = 'file' | 'camera' | 'preset'

interface CapturedFile {
  file: File
  preview: string
}

interface UseMediaUploadOptions {
  type: MediaType
  onSuccess?: (url: string, method: UploadMethod) => void
  onError?: (error: string) => void
  validationOptions?: FileValidationOptions
  autoRevalidate?: boolean
}


export function useMediaUpload({
  type,
  onSuccess,
  onError,
  validationOptions,
  autoRevalidate = true
}: UseMediaUploadOptions) {
  const { updateAvatar, updateBanner } = useUserActions()
  const resolvedValidationOptions = validationOptions || (type === 'avatar' ? AVATAR_OPTIONS : BANNER_OPTIONS)

  // Estados simplificados
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturedFile, setCapturedFile] = useState<CapturedFile | null>(null)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [fileForCropping, setFileForCropping] = useState<File | null>(null)
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Función para redimensionar imagen sin crop
  const resizeImage = useCallback(async (
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.9
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('No se pudo crear contexto del canvas'))
        return
      }

      img.onload = () => {
        let { width, height } = img

        // Calcular nuevo tamaño manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al procesar la imagen'))
              return
            }

            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(resizedFile)
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => reject(new Error('Error al cargar la imagen'))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  // Función optimizada para limpiar URLs
  const revokePreviewUrl = useCallback((url: string | null | undefined) => {
    if (url && !url.startsWith('http') && !url.startsWith('data:')) {
      try {
        URL.revokeObjectURL(url)
      } catch (error) {
        // Silenciar errores de URLs ya revocadas
      }
    }
  }, [])

  // Reset state optimizado
  const resetState = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    revokePreviewUrl(previewUrl)
    revokePreviewUrl(capturedFile?.preview)

    setSelectedFile(null)
    setPreviewUrl(null)
    setCapturedFile(null)
    setFileForCropping(null)
    setPendingFile(null)
    setShowCropDialog(false)
    setUploadProgress(0)
    setIsUploading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [previewUrl, capturedFile, revokePreviewUrl])

  // Función mejorada para manejar selección de archivos
  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true)
        
        const validation = await fileValidation(file, resolvedValidationOptions)

        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        if (validation.needsCropping) {
          setFileForCropping(file)
          setIsCropperOpen(true)
          toast.info('La imagen es muy grande y necesita ser recortada.')
          return
        }

        if (validation.shouldOptimize) {
          setPendingFile(file)
          setShowCropDialog(true)
          return
        }

        // Imagen ya tiene buen tamaño, usar directamente
        setSelectedFile(file)
        setCapturedFile(null)

        revokePreviewUrl(previewUrl)
        const preview = URL.createObjectURL(file)
        setPreviewUrl(preview)
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Archivo inválido'
        toast.error(errorMessage)
        onError?.(errorMessage)
        resetState()
      } finally {
        setIsUploading(false)
      }
    },
    [resolvedValidationOptions, previewUrl, onError, resetState, revokePreviewUrl]
  )

  // Función mejorada para manejar captura de cámara
  const handleCameraCapture = useCallback(
    async (file: File) => {
      try {
        setPendingFile(file)
        setShowCropDialog(true)
        setIsCameraOpen(false)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error procesando captura'
        toast.error(errorMessage)
        onError?.(errorMessage)
        setIsCameraOpen(false)
      }
    },
    [onError]
  )

  // Función para manejar la decisión del usuario sobre crop/resize
  const handleOptimizationDecision = useCallback(
    async (decision: 'crop' | 'resize' | 'keep') => {
      if (!pendingFile) return

      try {
        setIsUploading(true)
        setShowCropDialog(false)

        switch (decision) {
          case 'crop':
            setFileForCropping(pendingFile)
            setIsCropperOpen(true)
            setPendingFile(null)
            toast.info('Puedes recortar la imagen como prefieras.')
            break

          case 'resize':
            const resizedFile = await resizeImage(
              pendingFile,
              resolvedValidationOptions.maxWidth || 1920,
              resolvedValidationOptions.maxHeight || 1080,
              0.8
            )
            setSelectedFile(resizedFile)
            setCapturedFile(null)
            setPendingFile(null)

            revokePreviewUrl(previewUrl)
            const preview = URL.createObjectURL(resizedFile)
            setPreviewUrl(preview)
            toast.success('Imagen redimensionada automáticamente.')
            break

          case 'keep':
            setSelectedFile(pendingFile)
            setCapturedFile(null)
            setPendingFile(null)

            revokePreviewUrl(previewUrl)
            const keepPreview = URL.createObjectURL(pendingFile)
            setPreviewUrl(keepPreview)
            toast.success('Imagen guardada en tamaño original.')
            break
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error procesando imagen'
        toast.error(errorMessage)
        onError?.(errorMessage)
        resetState()
      } finally {
        setIsUploading(false)
      }
    },
    [pendingFile, resolvedValidationOptions, previewUrl, onError, resetState, revokePreviewUrl, resizeImage]
  )

  const handleOptimizationDialogClose = useCallback(() => {
    setShowCropDialog(false)
    setPendingFile(null)
  }, [])

  // Función optimizada para subir archivos con contexto global
  const uploadFile = useCallback(
    async (file: File, method: UploadMethod = 'file') => {
      if (isUploading) return

      setIsUploading(true)
      setUploadProgress(0)

      // Crear AbortController para poder cancelar
      abortControllerRef.current = new AbortController()

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        setUploadProgress(10)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal
        })

        setUploadProgress(60)

        if (!response.ok) {
          let errorMessage = `Error al subir ${type}`
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch {}
          throw new Error(errorMessage)
        }

        const data = await response.json()
        setUploadProgress(90)

        if (!data.url) {
          throw new Error('No se recibió URL del archivo subido')
        }

        // Actualizar contexto global en lugar de invalidar caché manualmente
        if (type === 'avatar') {
          await updateAvatar(data.url)
        } else {
          updateBanner(data.url)
        }
        
        setUploadProgress(100)

        resetState()
        onSuccess?.(data.url, method)
        toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} actualizado correctamente`)
        
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          toast.info('Subida cancelada')
          return
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        toast.error(errorMessage)
        onError?.(errorMessage)
      } finally {
        setIsUploading(false)
        abortControllerRef.current = null
        setTimeout(() => setUploadProgress(0), 2000)
      }
    },
    [type, resetState, onSuccess, onError, isUploading, updateAvatar, updateBanner]
  )

  // Función mejorada para presets con contexto global
  const usePreset = useCallback(
    async (presetUrl: string) => {
      if (isUploading) return

      setIsUploading(true)
      setUploadProgress(0)

      try {
        setUploadProgress(20)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, presetUrl }),
        })

        setUploadProgress(70)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Error al actualizar ${type}`)
        }

        const data = await response.json()
        
        // Actualizar contexto global
        if (type === 'avatar') {
          await updateAvatar(data.url || presetUrl)
        } else {
          updateBanner(data.url || presetUrl)
        }
        
        setUploadProgress(100)

        resetState()
        onSuccess?.(data.url || presetUrl, 'preset')
        toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} actualizado correctamente`)
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        toast.error(errorMessage)
        onError?.(errorMessage)
      } finally {
        setIsUploading(false)
        setTimeout(() => setUploadProgress(0), 1000)
      }
    },
    [type, resetState, onSuccess, onError, isUploading, updateAvatar, updateBanner]
  )

  // Funciones de control simplificadas
  const openFileSelector = useCallback(() => fileInputRef.current?.click(), [])
  const openCamera = useCallback(() => setIsCameraOpen(true), [])
  const closeCamera = useCallback(() => setIsCameraOpen(false), [])
  
  const retakePhoto = useCallback(() => {
    if (capturedFile) {
      revokePreviewUrl(capturedFile.preview)
      setCapturedFile(null)
    }
    setPreviewUrl(null)
    setIsCameraOpen(true)
  }, [capturedFile, revokePreviewUrl])

  const uploadSelectedFile = useCallback(() => {
    const fileToUpload = capturedFile?.file || selectedFile
    if (!fileToUpload) {
      const errorMsg = 'No hay archivo seleccionado para subir.'
      toast.error(errorMsg)
      return Promise.reject(errorMsg)
    }

    const method: UploadMethod = capturedFile ? 'camera' : 'file'
    return uploadFile(fileToUpload, method)
  }, [selectedFile, capturedFile, uploadFile])

  const handleCropComplete = useCallback(
    (croppedFile: File) => {
      setSelectedFile(croppedFile)
      setCapturedFile(null)
      setFileForCropping(null)
      setIsCropperOpen(false)

      revokePreviewUrl(previewUrl)
      const preview = URL.createObjectURL(croppedFile)
      setPreviewUrl(preview)

      toast.success('Imagen recortada correctamente')
    },
    [previewUrl, revokePreviewUrl]
  )

  const onFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) handleFileSelect(file)
    },
    [handleFileSelect]
  )

  // Props para componentes
  const cameraProps = {
    isOpen: isCameraOpen,
    onClose: closeCamera,
    onCapture: handleCameraCapture,
    title: `Tomar foto para ${type}`,
    maxWidth: resolvedValidationOptions.maxWidth,
    maxHeight: resolvedValidationOptions.maxHeight,
    quality: 0.8,
  }

  const fileInputProps = {
    ref: fileInputRef,
    type: 'file' as const,
    accept: resolvedValidationOptions.allowedTypes?.join(',') || 'image/*',
    onChange: onFileInputChange,
    style: { display: 'none' },
    multiple: false,
  }

  const cropperProps = {
    isOpen: isCropperOpen,
    onClose: () => {
      setIsCropperOpen(false)
      setFileForCropping(null)
    },
    imageFile: fileForCropping!,
    aspectRatio: type === 'avatar' ? 1 : 16 / 9,
    onCropComplete: handleCropComplete,
    maxWidth: resolvedValidationOptions.maxWidth || 1920,
    maxHeight: resolvedValidationOptions.maxHeight || 1080,
  }

  // Función para cancelar upload
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    // Estados
    isUploading,
    uploadProgress,
    selectedFile,
    capturedFile,
    previewUrl,
    isCameraOpen,
    isCropperOpen,
    fileForCropping,
    showCropDialog,
    pendingFile,

    // Métodos
    handleFileSelect,
    openFileSelector,
    openCamera,
    closeCamera,
    retakePhoto,
    uploadSelectedFile,
    usePreset,
    resetState,
    cancelUpload,
    handleCropComplete,
    handleOptimizationDecision,
    handleOptimizationDialogClose,

    // Props para componentes
    cameraProps,
    fileInputProps,
    cropperProps,

    // Estados computados
    hasSelectedFile: !!(selectedFile || capturedFile),
    hasPreview: !!previewUrl,
    isFromCamera: !!capturedFile,
    needsCropping: !!fileForCropping,
    getCurrentPreview: () => previewUrl,
    
    // Configuración
    resolvedValidationOptions,
  }
}