'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { UseImageOptimizationProps } from '../types'
import { resizeImage } from '../../utils/media/image-utils'

export function useImageOptimization({
  validationOptions,
  onOptimized,
  onNeedsCropping
}: UseImageOptimizationProps) {
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  /**
   * Muestra el diálogo de optimización
   */
  const checkOptimization = useCallback((file: File) => {
    setPendingFile(file)
    setShowCropDialog(true)
  }, [])

  /**
   * Maneja la decisión del usuario sobre cómo optimizar
   */
  const handleOptimizationDecision = useCallback(
    async (decision: 'crop' | 'resize' | 'keep') => {
      if (!pendingFile) return

      try {
        setShowCropDialog(false)

        switch (decision) {
          case 'crop':
            // Delegar al cropper
            onNeedsCropping?.(pendingFile)
            setPendingFile(null)
            toast.info('Puedes recortar la imagen como prefieras.')
            break

          case 'resize':
            // Redimensionar automáticamente
            const resizedFile = await resizeImage(
              pendingFile,
              validationOptions.maxWidth || 1920,
              validationOptions.maxHeight || 1080,
              0.8
            )
            setPendingFile(null)
            onOptimized?.(resizedFile, 'resize')
            toast.success('Imagen redimensionada automáticamente.')
            break

          case 'keep':
            // Mantener tamaño original
            const keptFile = pendingFile
            setPendingFile(null)
            onOptimized?.(keptFile, 'keep')
            toast.success('Imagen guardada en tamaño original.')
            break
        }
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Error procesando imagen'

        toast.error(errorMessage)
        setPendingFile(null)
        setShowCropDialog(false)
      }
    },
    [pendingFile, validationOptions, onOptimized, onNeedsCropping]
  )

  /**
   * Cierra el diálogo sin hacer nada
   */
  const closeOptimizationDialog = useCallback(() => {
    setShowCropDialog(false)
    setPendingFile(null)
  }, [])

  return {
    // Estados
    showCropDialog,
    pendingFile,
    isOptimizing: showCropDialog,

    // Métodos
    checkOptimization,
    handleOptimizationDecision,
    closeOptimizationDialog
  }
}