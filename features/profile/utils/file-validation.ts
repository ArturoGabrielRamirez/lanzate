/* // src/utils/file-validation.ts
export interface FileValidationOptions {
  maxSize?: number // en bytes - aumentamos el límite
  allowedTypes?: string[]
  maxWidth?: number // para imágenes
  maxHeight?: number // para imágenes
  allowCropping?: boolean // nueva opción para permitir recorte
}

export const DEFAULT_IMAGE_OPTIONS: FileValidationOptions = {
  maxSize: 50 * 1024 * 1024, // 50MB - aumentamos significativamente
  allowedTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff'
  ],
  maxWidth: 4000, // Aumentamos límite de ancho
  maxHeight: 4000, // Aumentamos límite de alto
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
): Promise<{ isValid: boolean; needsCropping?: boolean; error?: string }> {
  const { maxSize, allowedTypes, maxWidth, maxHeight, allowCropping } = options

  // Validar tamaño de archivo
  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Máximo ${formatFileSize(maxSize)}.`
    }
  }

  // Validar tipo de archivo
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Solo se permiten: ${allowedTypes.join(', ')}`
    }
  }

  // Validar dimensiones para imágenes
  if (file.type.startsWith('image/') && (maxWidth || maxHeight)) {
    const dimensions = await getImageDimensions(file)
    
    const exceedsWidth = maxWidth && dimensions.width > maxWidth
    const exceedsHeight = maxHeight && dimensions.height > maxHeight
    
    if (exceedsWidth || exceedsHeight) {
      if (allowCropping) {
        return {
          isValid: true,
          needsCropping: true,
          error: `La imagen es muy grande (${dimensions.width}x${dimensions.height}px). Se puede recortar automáticamente.`
        }
      } else {
        return {
          isValid: false,
          error: `La imagen es demasiado grande. Máximo ${maxWidth}x${maxHeight}px.`
        }
      }
    }
  }

  return { isValid: true }
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
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
    const img = new Image()
    
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
} */