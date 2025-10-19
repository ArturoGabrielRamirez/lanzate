'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { UseImageCropperProps } from '../types'

export function useImageCropper({
  aspectRatio,
  maxWidth = 1920,
  maxHeight = 1080,
  onCropComplete
}: UseImageCropperProps) {
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [fileForCropping, setFileForCropping] = useState<File | null>(null)

  /**
   * Abre el cropper con un archivo
   */
  const startCropping = useCallback((file: File) => {
    setFileForCropping(file)
    setIsCropperOpen(true)
  }, [])

  /**
   * Maneja la imagen recortada
   */
  const handleCropComplete = useCallback(
    (croppedFile: File) => {
      setFileForCropping(null)
      setIsCropperOpen(false)

      toast.success('Imagen recortada correctamente')
      onCropComplete?.(croppedFile)
    },
    [onCropComplete]
  )

  /**
   * Cancela el cropping
   */
  const cancelCropping = useCallback(() => {
    setFileForCropping(null)
    setIsCropperOpen(false)
  }, [])

  /**
   * Props para el componente ImageCropper
   */
  const cropperProps = {
    isOpen: isCropperOpen,
    onClose: cancelCropping,
    imageFile: fileForCropping!,
    aspectRatio,
    onCropComplete: handleCropComplete,
    maxWidth,
    maxHeight,
  }

  return {
    // Estados
    isCropperOpen,
    fileForCropping,
    needsCropping: !!fileForCropping,

    // Métodos
    startCropping,
    handleCropComplete,
    cancelCropping,

    // Props
    cropperProps
  }
}