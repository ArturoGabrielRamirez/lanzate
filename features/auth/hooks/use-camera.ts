// src/features/auth/hooks/use-camera.ts
'use client'

import { useState, useCallback } from 'react'

interface CapturedFile {
  file: File
  preview: string
}

interface UseCameraOptions {
 uploadPath: 'avatar' | 'banner' | (string & {})
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export function useCamera({
  uploadPath,
  onSuccess,
  onError,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
}: UseCameraOptions) {
  const [capturedFile, setCapturedFile] = useState<CapturedFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  // Abrir cámara
  const openCamera = useCallback(() => {
    setIsCameraOpen(true)
  }, [])

  // Cerrar cámara
  const closeCamera = useCallback(() => {
    setIsCameraOpen(false)
  }, [])

  // Capturar foto desde el componente de cámara
  const handleCapture = useCallback((file: File) => {
    const preview = URL.createObjectURL(file)
    setCapturedFile({ file, preview })
    setIsCameraOpen(false)
  }, [])

  // Retomar foto
  const retakePhoto = useCallback(() => {
    if (capturedFile) {
      URL.revokeObjectURL(capturedFile.preview)
      setCapturedFile(null)
    }
    setIsCameraOpen(true)
  }, [capturedFile])

  // Descartar foto
  const discardPhoto = useCallback(() => {
    if (capturedFile) {
      URL.revokeObjectURL(capturedFile.preview)
      setCapturedFile(null)
    }
  }, [capturedFile])

  // Subir foto usando la nueva API
  const uploadPhoto = useCallback(async () => {
    if (!capturedFile) {
      onError?.('No hay foto para subir')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', capturedFile.file)
      formData.append('type', uploadPath)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al subir la imagen')
      }

      const data = await response.json()
      
      if (!data.url) {
        throw new Error('La respuesta no contiene la URL del archivo')
      }

      // Limpiar archivo capturado
      URL.revokeObjectURL(capturedFile.preview)
      setCapturedFile(null)

      // Callback de éxito
      onSuccess?.(data.url)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      onError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }, [capturedFile, uploadPath, onSuccess, onError])

  // Props para el componente de cámara
  const cameraProps = {
    isOpen: isCameraOpen,
    onClose: closeCamera,
    onCapture: handleCapture,
    maxWidth,
    maxHeight,
    quality
  }

  return {
    // Estado
    capturedFile,
    isUploading,
    isCameraOpen,
    
    // Métodos
    openCamera,
    closeCamera,
    retakePhoto,
    discardPhoto,
    uploadPhoto,
    
    // Props para el componente
    cameraProps
  }
}