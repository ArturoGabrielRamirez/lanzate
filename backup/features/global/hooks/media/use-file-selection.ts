'use client'

import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'

import type { UseFileSelectionProps } from '@/features/global/types/media'
import { createPreviewUrl, revokePreviewUrl } from '@/features/global/utils/media/preview-manager'
import { fileValidation } from '@/features/profile/utils/file-validation-client'

export function useFileSelection({
  validationOptions,
  onValidationError,
  onNeedsCropping,
  onNeedsOptimization
}: UseFileSelectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Limpia el archivo y preview seleccionado
   */
  const clearSelection = useCallback(() => {
    revokePreviewUrl(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [previewUrl])

  /**
   * Maneja la selección de archivo con validación
   */
  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        // Validar archivo
        const validation = await fileValidation(file, validationOptions)

        if (!validation.isValid) {
          const errorMessage = validation.error || 'Archivo inválido'
          toast.error(errorMessage)
          onValidationError?.(errorMessage)
          clearSelection()
          return false
        }

        // Si necesita cropping, delegar
        if (validation.needsCropping) {
          onNeedsCropping?.(file)
          toast.info('La imagen es muy grande y necesita ser recortada.')
          return false
        }

        // Si necesita optimización, delegar
        if (validation.shouldOptimize) {
          onNeedsOptimization?.(file)
          return false
        }

        // Archivo válido, crear preview
        revokePreviewUrl(previewUrl)
        const preview = createPreviewUrl(file)

        setSelectedFile(file)
        setPreviewUrl(preview)

        return true
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Error procesando archivo'

        toast.error(errorMessage)
        onValidationError?.(errorMessage)
        clearSelection()
        return false
      }
    },
    [validationOptions, previewUrl, onValidationError, onNeedsCropping, onNeedsOptimization, clearSelection]
  )

  /**
   * Abre el selector de archivos
   */
  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /**
   * Handler para el input file
   */
  const onFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect]
  )

  /**
   * Actualiza el archivo seleccionado (útil después de crop/optimization)
   */
  const updateSelectedFile = useCallback(
    (file: File) => {
      revokePreviewUrl(previewUrl)
      const preview = createPreviewUrl(file)
      setSelectedFile(file)
      setPreviewUrl(preview)
    },
    [previewUrl]
  )

  /**
   * Props para el input file
   */
  const fileInputProps = {
    ref: fileInputRef,
    type: 'file' as const,
    accept: validationOptions.allowedTypes?.join(',') || 'image/*',
    onChange: onFileInputChange,
    style: { display: 'none' },
    multiple: false,
  }

  return {
    // Estados
    selectedFile,
    previewUrl,
    hasSelectedFile: !!selectedFile,

    // Refs
    fileInputRef,

    // Métodos
    handleFileSelect,
    openFileSelector,
    clearSelection,
    updateSelectedFile,

    // Props
    fileInputProps
  }
}