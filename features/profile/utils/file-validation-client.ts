'use client'

import { FileValidationOptions, ValidationResult } from '@/features/profile/types'



export const DEFAULT_IMAGE_OPTIONS: FileValidationOptions = {
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff'
  ],
  maxWidth: 4000,
  maxHeight: 4000,
  allowCropping: true
}

export const AVATAR_OPTIONS: FileValidationOptions = {
  ...DEFAULT_IMAGE_OPTIONS,
  maxWidth: 2000,
  maxHeight: 2000,
  allowCropping: true
}

export const BANNER_OPTIONS: FileValidationOptions = {
  ...DEFAULT_IMAGE_OPTIONS,
  maxWidth: 4000,
  maxHeight: 2000,
  allowCropping: true
}

export class FileValidationError extends Error {
  public readonly canBeCropped: boolean

  constructor(message: string, canBeCropped = false) {
    super(message)
    this.name = 'FileValidationError'
    this.canBeCropped = canBeCropped
  }
}

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

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new FileValidationError('No se pudo procesar la imagen.'))
    }

    img.src = url
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(contentType: string): string {
  const extensionMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff'
  }

  return extensionMap[contentType] || 'jpg'
}

// Función para comprimir imagen si es necesario
export async function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new window.Image()

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height)

      // Convertir a blob
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(compressedFile)
        } else {
          resolve(file) // Fallback al archivo original
        }
      }, 'image/jpeg', quality)
    }

    img.src = URL.createObjectURL(file)
  })
}

// Función utilitaria para obtener recomendaciones de tamaño
export const getSizeRecommendations = (type: 'avatar' | 'banner') => {
  if (type === 'avatar') {
    return {
      recommended: { width: 400, height: 400 },
      maximum: { width: 2000, height: 2000 },
      description: 'Cuadrada, ideal entre 200x200 y 400x400 píxeles'
    }
  }

  return {
    recommended: { width: 1200, height: 400 },
    maximum: { width: 4000, height: 2000 },
    description: 'Rectangular, ideal 3:1 o 16:9, máximo 4000x2000 píxeles'
  }
}