'use client'

import { DEFAULT_IMAGE_OPTIONS } from '@/features/profile/constants'
import { FileValidationOptions, ValidationResult } from '@/features/profile/types'
import { formatFileSize } from '@/features/profile/utils/format-file-size'
import { getImageDimensions } from '@/features/profile/utils/get-image-dimensions'

export async function fileValidation(
  file: File,
  options: FileValidationOptions = DEFAULT_IMAGE_OPTIONS
): Promise<ValidationResult> {
  const { maxSize, allowedTypes, maxWidth, maxHeight, allowCropping } = options

  // Validar tamaño de archivo
  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Máximo ${formatFileSize(maxSize)}.`,
      needsCropping: false,
      shouldOptimize: false,
      fileSize: file.size
    }
  }

  // Validar tipo de archivo
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Solo se permiten: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`,
      needsCropping: false,
      shouldOptimize: false,
      fileSize: file.size
    }
  }

  // Validar dimensiones para imágenes
  if (file.type.startsWith('image/') && (maxWidth || maxHeight)) {
    try {
      const dimensions = await getImageDimensions(file)

      // Definir umbrales para diferentes tipos de procesamiento
      const CROP_THRESHOLD_MULTIPLIER = 2.5 // Si es 2.5x más grande, crop obligatorio
      const OPTIMIZE_THRESHOLD_MULTIPLIER = 1.3 // Si es 1.3x más grande, sugerir optimización
      const LARGE_FILE_THRESHOLD = 3 * 1024 * 1024 // 3MB

      const exceedsWidthSignificantly = maxWidth && dimensions.width > maxWidth * CROP_THRESHOLD_MULTIPLIER
      const exceedsHeightSignificantly = maxHeight && dimensions.height > maxHeight * CROP_THRESHOLD_MULTIPLIER
      const needsCropping = exceedsWidthSignificantly || exceedsHeightSignificantly

      const exceedsWidthModerately = maxWidth && dimensions.width > maxWidth * OPTIMIZE_THRESHOLD_MULTIPLIER
      const exceedsHeightModerately = maxHeight && dimensions.height > maxHeight * OPTIMIZE_THRESHOLD_MULTIPLIER
      const isLargeFile = file.size > LARGE_FILE_THRESHOLD

      // Sugerir optimización si excede moderadamente O es archivo grande
      const shouldOptimize = (exceedsWidthModerately || exceedsHeightModerately || isLargeFile) && !needsCropping

      // Si necesita crop obligatorio
      if (needsCropping) {
        if (allowCropping) {
          return {
            isValid: true,
            needsCropping: true,
            shouldOptimize: false,
            originalDimensions: dimensions,
            fileSize: file.size,
            error: `La imagen es muy grande (${dimensions.width}x${dimensions.height}px). Necesita ser recortada.`
          }
        } else {
          return {
            isValid: false,
            error: `La imagen es demasiado grande. Máximo ${maxWidth}x${maxHeight}px.`,
            needsCropping: false,
            shouldOptimize: false,
            originalDimensions: dimensions,
            fileSize: file.size
          }
        }
      }

      // Imagen válida, determinar si debe optimizarse
      return {
        isValid: true,
        needsCropping: false,
        shouldOptimize,
        originalDimensions: dimensions,
        fileSize: file.size
      }

    } catch (error) {
      return {
        isValid: false,
        error: 'No se pudo procesar la imagen.',
        needsCropping: false,
        shouldOptimize: false,
        fileSize: file.size
      }
    }
  }

  return {
    isValid: true,
    needsCropping: false,
    shouldOptimize: false,
    fileSize: file.size
  }
}
