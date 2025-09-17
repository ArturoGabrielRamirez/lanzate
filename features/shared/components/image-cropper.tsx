'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RotateCw, ZoomIn, ZoomOut, Check, X, Loader2 } from 'lucide-react'
import ReactCrop, { PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
  isOpen: boolean
  onClose: () => void
  imageFile: File | null
  aspectRatio?: number
  onCropComplete: (croppedFile: File) => void
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export function ImageCropper({
  isOpen,
  onClose,
  imageFile,
  aspectRatio = 1,
  onCropComplete,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.9,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<PixelCrop | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const imageRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isOpen && imageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setPreviewUrl(e.target.result)
          const img = new Image()
          img.src = e.target.result
          img.onload = () => {
            setImage(img)
            const imgWidth = img.naturalWidth
            const imgHeight = img.naturalHeight
            const aspectRatioActual = imgWidth / imgHeight

            let initialCropWidth, initialCropHeight

            if (aspectRatioActual > aspectRatio) {
              initialCropHeight = imgHeight
              initialCropWidth = imgHeight * aspectRatio
            } else {
              initialCropWidth = imgWidth
              initialCropHeight = imgWidth / aspectRatio
            }

            initialCropWidth = Math.min(initialCropWidth, imgWidth)
            initialCropHeight = Math.min(initialCropHeight, imgHeight)

            setCrop({
              x: (imgWidth - initialCropWidth) / 2,
              y: (imgHeight - initialCropHeight) / 2,
              width: initialCropWidth,
              height: initialCropHeight,
              unit: 'px',
            })
          }
        }
      }
      reader.readAsDataURL(imageFile)
    } else {
      setPreviewUrl(null)
      setImage(null)
      setCrop(null)
    }

    return () => {
      if (previewUrl && !previewUrl.startsWith('data:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [isOpen, imageFile, aspectRatio])

  const cropImage = useCallback(async () => {
    if (!image || !previewCanvasRef.current || !crop) return

    setIsProcessing(true)

    try {
      const canvas = previewCanvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo obtener contexto del canvas')

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      let finalWidth = crop.width * scaleX
      let finalHeight = crop.height * scaleY

      if (finalWidth > maxWidth) {
        const scale = maxWidth / finalWidth
        finalWidth = maxWidth
        finalHeight *= scale
      }

      if (finalHeight > maxHeight) {
        const scale = maxHeight / finalHeight
        finalHeight = maxHeight
        finalWidth *= scale
      }

      canvas.width = finalWidth
      canvas.height = finalHeight

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        finalWidth,
        finalHeight
      )

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Error al procesar la imagen: El blob es null.')
            return
          }

          const fileName = `cropped_${Date.now()}.jpeg`
          const croppedFile = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          onCropComplete(croppedFile)
          onClose()
        },
        'image/jpeg',
        quality
      )
    } catch (error) {
      console.error('Error al recortar imagen:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [image, crop, maxWidth, maxHeight, quality, onCropComplete, onClose])

  const handleClose = () => {
    onClose()
    setPreviewUrl(null)
    setImage(null)
    setCrop(null)
  }

  if (!isOpen || !imageFile) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Recortar Imagen -{' '}
            {aspectRatio === 1 ? 'Avatar' : aspectRatio === 16 / 9 ? 'Banner' : 'Custom'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden text-center">
            {previewUrl ? (
              <ReactCrop
                crop={crop as PixelCrop}
                onChange={(c) => setCrop(c)}
                aspect={aspectRatio}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              >
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Imagen para recortar"
                  className="max-w-full max-h-[400px] mx-auto"
                  onLoad={(e) => {
                    const imgElement = e.currentTarget as HTMLImageElement
                    setImage(imgElement)
                    if (!crop) {
                      const imgWidth = imgElement.naturalWidth
                      const imgHeight = imgElement.naturalHeight
                      const aspectRatioActual = imgWidth / imgHeight

                      let initialCropWidth, initialCropHeight

                      if (aspectRatioActual > aspectRatio) {
                        initialCropHeight = imgHeight
                        initialCropWidth = imgHeight * aspectRatio
                      } else {
                        initialCropWidth = imgWidth
                        initialCropHeight = imgWidth / aspectRatio
                      }

                      initialCropWidth = Math.min(initialCropWidth, imgWidth)
                      initialCropHeight = Math.min(initialCropHeight, imgHeight)

                      setCrop({
                        x: (imgWidth - initialCropWidth) / 2,
                        y: (imgHeight - initialCropHeight) / 2,
                        width: initialCropWidth,
                        height: initialCropHeight,
                        unit: 'px',
                      })
                    }
                  }}
                />
              </ReactCrop>
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={cropImage} disabled={isProcessing || !crop || !image}>
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Recortar y Usar
                </>
              )}
            </Button>
          </div>
        </div>

        <canvas ref={previewCanvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}