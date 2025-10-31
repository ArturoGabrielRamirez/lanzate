// features/shared/utils/image-utils.ts

/**
 * Redimensiona una imagen sin crop
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.9
): Promise<File> {
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
}

/**
 * Revoca URLs de preview de forma segura
 */
export function revokePreviewUrl(url: string | null | undefined): void {
  if (url && !url.startsWith('http') && !url.startsWith('data:')) {
    try {
      URL.revokeObjectURL(url)
    } catch (error) {
      // Silenciar errores de URLs ya revocadas
    }
  }
}

/**
 * Crea un preview URL de un archivo
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}