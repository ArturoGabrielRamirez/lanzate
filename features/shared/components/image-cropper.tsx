'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/features/shadcn/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/features/shadcn/components/ui/dialog'
import { Check, X, Loader2, ZoomIn, ZoomOut, Minimize2, Maximize2, Lock, Unlock } from 'lucide-react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Slider } from '@/features/shadcn/components/ui/slider'
/* import { Label } from '@/components/ui/label' */
import { ImageCropperProps } from '../types'

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
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [aspectLocked, setAspectLocked] = useState(true)
  const [cropMode, setCropMode] = useState<'normal' | 'maximized'>('normal')
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number }>()
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // Cargar imagen cuando se abre el diálogo
  useEffect(() => {
    if (isOpen && imageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setPreviewUrl(e.target.result)
        }
      }
      reader.readAsDataURL(imageFile)
    } else {
      // Reset al cerrar
      setPreviewUrl(null)
      setCrop(undefined)
      setCompletedCrop(undefined)
      setZoom(100)
      setCropMode('normal')
      setImgDimensions(undefined)
    }

    return () => {
      if (previewUrl && !previewUrl.startsWith('data:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [isOpen, imageFile])

  // Inicializar crop cuando la imagen se carga
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget
    setImgDimensions({ width: naturalWidth, height: naturalHeight })

    // Calcular crop inicial según el tipo de imagen
    let cropSize: number
    
    if (aspectRatio === 1) {
      // Avatar: más grande y cuadrado (65% del área)
      cropSize = 65
    } else if (aspectRatio === 16 / 9) {
      // Banner: más rectangular y amplio (75% del área)
      cropSize = 75
    } else {
      // Custom: tamaño intermedio
      cropSize = 60
    }

    const cropWidthInPercent = aspectRatio >= 1 ? cropSize : cropSize * aspectRatio
    const cropHeightInPercent = aspectRatio <= 1 ? cropSize : cropSize / aspectRatio

    const initialCrop: Crop = {
      unit: '%',
      x: (100 - cropWidthInPercent) / 2,
      y: (100 - cropHeightInPercent) / 2,
      width: cropWidthInPercent,
      height: cropHeightInPercent,
    }

    setCrop(initialCrop)
  }

  const cropImage = useCallback(async () => {
    if (!imgRef.current || !previewCanvasRef.current || !completedCrop) return

    setIsProcessing(true)
    try {
      const image = imgRef.current
      const canvas = previewCanvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo obtener contexto del canvas')

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      // Dimensiones del crop en píxeles naturales
      let sourceWidth = completedCrop.width * scaleX
      let sourceHeight = completedCrop.height * scaleY
      let sourceX = completedCrop.x * scaleX
      let sourceY = completedCrop.y * scaleY

      // Aplicar límites máximos manteniendo aspect ratio
      let finalWidth = sourceWidth
      let finalHeight = sourceHeight

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

      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        finalWidth,
        finalHeight
      )

      const supportsWebP = canvas.toDataURL('image/webp').indexOf('image/webp') === 5
      const outputFormat = supportsWebP ? 'image/webp' : 'image/jpeg'
      const fileExtension = supportsWebP ? 'webp' : 'jpeg'

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Error al procesar la imagen')
            setIsProcessing(false)
            return
          }
          const fileName = `cropped_${Date.now()}.${fileExtension}`
          const croppedFile = new File([blob], fileName, {
            type: outputFormat,
            lastModified: Date.now(),
          })
          onCropComplete(croppedFile)
          handleClose()
        },
        outputFormat,
        quality
      )
    } catch (error) {
      console.error('Error al recortar imagen:', error)
      setIsProcessing(false)
    }
  }, [completedCrop, maxWidth, maxHeight, quality, onCropComplete])

  const handleResetCrop = () => {
    if (!imgRef.current) return
    
    setCropMode('normal')
    
    // Calcular tamaño según el tipo
    let cropSize: number
    
    if (aspectRatio === 1) {
      cropSize = 65 // Avatar: más grande y cuadrado
    } else if (aspectRatio === 16 / 9) {
      cropSize = 75 // Banner
    } else {
      cropSize = 60 // Custom
    }

    const cropWidthInPercent = aspectRatio >= 1 ? cropSize : cropSize * aspectRatio
    const cropHeightInPercent = aspectRatio <= 1 ? cropSize : cropSize / aspectRatio

    setCrop({
      unit: '%',
      x: (100 - cropWidthInPercent) / 2,
      y: (100 - cropHeightInPercent) / 2,
      width: cropWidthInPercent,
      height: cropHeightInPercent,
    })
    setZoom(100)
  }

  const handleMaximizeCrop = () => {
    if (cropMode === 'maximized') {
      // Si ya está maximizado, volver al normal
      handleResetCrop()
    } else {
      setCropMode('maximized')
      setCrop({
        unit: '%',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      })
    }
  }

  const toggleAspectLock = () => {
    setAspectLocked(!aspectLocked)
  }

  const handleClose = () => {
    onClose()
    setPreviewUrl(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
    setZoom(100)
    setCropMode('normal')
    setImgDimensions(undefined)
  }

  if (!isOpen || !imageFile) {
    return null
  }

  const cropTitle = aspectRatio === 1 
    ? 'Avatar (1:1)' 
    : aspectRatio === 16 / 9 
    ? 'Banner (16:9)' 
    : `Custom (${aspectRatio.toFixed(2)}:1)`

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Recortar Imagen - {cropTitle}</span>
            <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
              <span>Zoom: {zoom}%</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Controles superiores */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                disabled={zoom <= 50}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="w-32">
                <Slider
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                  min={50}
                  max={200}
                  step={10}
                  className="cursor-pointer"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                disabled={zoom >= 200}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <div className="h-6 w-px bg-border" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetCrop}
              title="Recorte normal centrado"
              className={cropMode === 'normal' ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100' : ''}
            >
              <Minimize2 className="w-4 h-4 mr-1" />
              Normal
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleMaximizeCrop}
              title="Maximizar a toda la imagen"
              className={cropMode === 'maximized' ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100' : ''}
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              Maximizar
            </Button>

            <div className="h-6 w-px bg-border" />

            <Button
              variant="outline"
              size="sm"
              onClick={toggleAspectLock}
              title={aspectLocked ? 'Desbloquear aspecto para recorte libre' : 'Bloquear aspecto ratio'}
              className={!aspectLocked ? 'border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100' : ''}
            >
              {aspectLocked ? (
                <>
                  <Lock className="w-4 h-4 mr-1" />
                  Bloqueado
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-1" />
                  Libre
                </>
              )}
            </Button>
          </div>

          {/* Área de recorte */}
          <div className="flex items-center justify-center overflow-auto bg-muted/20 rounded-lg p-4 min-h-[400px]">
            {previewUrl ? (
              <div style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease',
              }}>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectLocked ? aspectRatio : undefined}
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    ref={imgRef}
                    src={previewUrl}
                    alt="Vista previa"
                    style={{ 
                      maxWidth: '800px',
                      maxHeight: '500px',
                      width: 'auto',
                      height: 'auto',
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Canvas oculto para procesamiento */}
          <canvas ref={previewCanvasRef} className="hidden" />

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              <X className="w-4 h-4 mr-1" />
              Cancelar
            </Button>
            <Button
              onClick={cropImage}
              disabled={isProcessing || !completedCrop}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Recortar y Usar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}