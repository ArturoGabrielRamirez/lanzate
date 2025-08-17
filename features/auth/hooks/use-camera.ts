'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface UseCameraProps {
  uploadPath: string // 'avatar', 'product', 'document', etc.
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

interface CameraFile {
  file: File
  preview: string
}

export function useCamera({
  uploadPath,
  onSuccess,
  onError,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
}: UseCameraProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [capturedFile, setCapturedFile] = useState<CameraFile | null>(null)

  const openCamera = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCamera = useCallback(() => {
    setIsOpen(false)
    // Limpiar archivo capturado después de cerrar
    setTimeout(() => {
      if (capturedFile) {
        URL.revokeObjectURL(capturedFile.preview)
        setCapturedFile(null)
      }
    }, 100)
  }, [capturedFile])

  const handleCapture = useCallback((file: File) => {
    const preview = URL.createObjectURL(file)
    setCapturedFile({ file, preview })
    setIsOpen(false)
  }, [])

  const uploadPhoto = useCallback(async () => {
    if (!capturedFile) {
      toast.error('No hay foto para subir')
      return
    }

    setIsUploading(true)

    try {
      console.log('Subiendo foto desde cámara:', capturedFile.file.name)
      
      const formData = new FormData()
      formData.append('file', capturedFile.file)
      formData.append('type', uploadPath)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al subir la foto')
      }

      const data = await response.json()

      if (!data.url) {
        throw new Error('No se recibió URL del archivo')
      }

      // Limpiar archivo local
      URL.revokeObjectURL(capturedFile.preview)
      setCapturedFile(null)

      toast.success('Foto subida correctamente')
      onSuccess?.(data.url)

      return data

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('Error uploading photo:', error)
      toast.error(errorMessage)
      onError?.(errorMessage)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [capturedFile, uploadPath, onSuccess, onError])

  const discardPhoto = useCallback(() => {
    if (capturedFile) {
      URL.revokeObjectURL(capturedFile.preview)
      setCapturedFile(null)
    }
  }, [capturedFile])

  const retakePhoto = useCallback(() => {
    discardPhoto()
    setIsOpen(true)
  }, [discardPhoto])

  return {
    // Estados
    isOpen,
    isUploading,
    capturedFile,

    // Propiedades para el componente de cámara
    cameraProps: {
      isOpen,
      onClose: closeCamera,
      onCapture: handleCapture,
      maxWidth,
      maxHeight,
      quality
    },

    // Acciones
    openCamera,
    closeCamera,
    uploadPhoto,
    discardPhoto,
    retakePhoto
  }
}