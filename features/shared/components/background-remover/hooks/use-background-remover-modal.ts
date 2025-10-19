'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { UseBackgroundRemoverProps } from '../types'

export function useBackgroundRemoverModal({
  onProcessed
}: UseBackgroundRemoverProps = {}) {
  const [showBackgroundRemover, setShowBackgroundRemover] = useState(false)
  const [pendingFileForBgRemoval, setPendingFileForBgRemoval] = useState<File | null>(null)

  /**
   * Abre el removedor de fondo con un archivo
   */
  const openBackgroundRemover = useCallback((file: File | null) => {
    if (!file) {
      toast.error('Selecciona una imagen primero')
      return
    }

    setPendingFileForBgRemoval(file)
    setShowBackgroundRemover(true)
  }, [])

  /**
   * Maneja la imagen procesada
   */
  const handleBackgroundRemoved = useCallback(
    (processedFile: File) => {
      setShowBackgroundRemover(false)
      setPendingFileForBgRemoval(null)

      toast.success('Fondo removido exitosamente')
      onProcessed?.(processedFile)
    },
    [onProcessed]
  )

  /**
   * Cierra el removedor de fondo
   */
  const closeBackgroundRemover = useCallback(() => {
    setShowBackgroundRemover(false)
    setPendingFileForBgRemoval(null)
  }, [])

  /**
   * Props para el componente BackgroundRemover
   */
  const backgroundRemoverProps = {
    isOpen: showBackgroundRemover,
    onClose: closeBackgroundRemover,
    imageFile: pendingFileForBgRemoval,
    onProcessed: handleBackgroundRemoved
  }

  return {
    // Estados
    showBackgroundRemover,
    pendingFileForBgRemoval,
    isProcessingBackground: showBackgroundRemover,

    // Métodos
    openBackgroundRemover,
    handleBackgroundRemoved,
    closeBackgroundRemover,

    // Props
    backgroundRemoverProps
  }
}