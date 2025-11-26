'use client'

import { Upload, X, Camera, Crop, Wand2, Image as ImageIcon, Star } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { BackgroundRemover } from '@/features/global/components/background-remover'
import { ImageCropper } from '@/features/global/components/image-cropper'
import CameraComponent from '@/features/global/components/media-selector/camera-component'
import { useMediaUpload } from '@/features/global/hooks/media/use-media-upload'
import { getMediaConfig } from '@/features/global/types/media'
import { ProductMediaSelectorProps } from '@/features/products/types'
import { OptimizationDialog } from '@/features/profile/components/optimization-dialog'
import { Button } from '@/features/shadcn/components/ui/button'
import { Card } from '@/features/shadcn/components/ui/card'
import { cn } from '@/lib/utils'

export function ProductMediaSelector({
  value = [],
  onChange,
  maxFiles = 5
}: ProductMediaSelectorProps) {
  const config = getMediaConfig('product-image')

  const mediaUpload = useMediaUpload({
    type: 'product-image',
    validationOptions: config,
    deferredMode: true,
    maxFiles,
    value: value,
    onFilesChange: onChange,
    onError: (error) => toast.error(error)
  })

  const { deferredFiles, fileInputProps, canAddMoreFiles } = mediaUpload

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (let i = 0; i < files.length; i++) {
      await mediaUpload.handleFileSelect(files[i])
    }
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      {/* Grid de imágenes mejorado */}
      {deferredFiles.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {deferredFiles.map((file, index) => (
            <Card
              key={file.id}
              className={cn(
                "relative aspect-square overflow-hidden group cursor-pointer transition-all hover:shadow-lg",
                file.isPrimary && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {/* Imagen */}
              <div className="relative w-full h-full">
                <Image
                  src={file.preview}
                  alt={`Imagen ${index + 1}`}
                  fill // 🔑 CORRECCIÓN: Usar fill para que la imagen ocupe el contenedor.
                  className="object-cover"
                  unoptimized={true} // 🔑 CORRECCIÓN: Deshabilitar la optimización para URLs blob:
                />
              </div>

              {/* Overlay oscuro en hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200" />

              {/* Badge de índice (siempre visible) */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded">
                #{index + 1}
              </div>

              {/* Badge de principal (siempre visible si es principal) */}
              {file.isPrimary && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded flex items-center gap-1 shadow-lg">
                  <Star className="h-3 w-3 fill-current" />
                  Principal
                </div>
              )}

              {/* Botones de acción (visible en hover) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                {/* Botón marcar como principal */}
                {!file.isPrimary && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => mediaUpload.setPrimaryDeferredFile(file.id)}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Principal
                  </Button>
                )}

                {/* Botón recortar */}
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() => mediaUpload.openCropperForFile(file.id)}
                >
                  <Crop className="h-3 w-3 mr-1" />
                  Recortar
                </Button>

                {/* Botón eliminar */}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={() => mediaUpload.removeDeferredFile(file.id)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Panel de herramientas compacto */}
      {canAddMoreFiles && (
        <Card className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-3">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">
                {deferredFiles.length === 0
                  ? 'Agrega imágenes del producto'
                  : `${deferredFiles.length} de ${maxFiles} imágenes`}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona archivos o usa las herramientas
              </p>
            </div>

            {/* Botones principales */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => fileInputProps.ref.current?.click()}
              >
                <ImageIcon className="h-6 w-6" />
                <span className="text-sm font-medium">Seleccionar</span>
                <span className="text-xs text-muted-foreground">Desde tu equipo</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-auto py-4 flex-col gap-2"
                onClick={mediaUpload.openCamera}
              >
                <Camera className="h-6 w-6" />
                <span className="text-sm font-medium">Tomar foto</span>
                <span className="text-xs text-muted-foreground">Usa la cámara</span>
              </Button>
            </div>

            {/* Herramientas adicionales (solo si hay imágenes) */}
            {deferredFiles.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-3 text-center">
                  Herramientas de edición
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      const lastFile = deferredFiles[deferredFiles.length - 1]
                      if (lastFile) mediaUpload.openCropperForFile(lastFile.id)
                    }}
                  >
                    <Crop className="h-4 w-4 mr-2" />
                    Recortar última
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={mediaUpload.openBackgroundRemover}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Quitar fondo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Mensaje de límite alcanzado */}
      {!canAddMoreFiles && (
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-center text-muted-foreground">
            Has alcanzado el límite de {maxFiles} imágenes.
            Elimina alguna para agregar más.
          </p>
        </Card>
      )}

      {/* Input oculto */}
      <input
        {...fileInputProps}
        onChange={handleFileInputChange}
        multiple
        accept="image/*"
      />

      {/* Modales */}
      {mediaUpload.isCameraOpen && (
        <CameraComponent {...mediaUpload.cameraProps} />
      )}

      {mediaUpload.isCropperOpen && (
        <ImageCropper {...mediaUpload.cropperProps} />
      )}

      {mediaUpload.showCropDialog && (
        <OptimizationDialog
          isOpen={mediaUpload.showCropDialog}
          onDecision={mediaUpload.handleOptimizationDecision}
          onClose={mediaUpload.handleOptimizationDialogClose}
          imageFile={mediaUpload.pendingFile}
          type="avatar"
          maxWidth={config.maxWidth}
          maxHeight={config.maxHeight}
        />
      )}

      {mediaUpload.showBackgroundRemover && (
        <BackgroundRemover {...mediaUpload.backgroundRemoverProps} />
      )}
    </div>
  )
}