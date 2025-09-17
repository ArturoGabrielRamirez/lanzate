'use client'

import { useState, useCallback, useEffect, useMemo, memo } from 'react'
import { Camera, Upload, Image, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useMediaUpload, MediaType } from '@/features/shared/hooks/use-media-upload'
import CameraComponent from '@/features/auth/components/avatar/camera-component'
import { ImageCropper } from './image-cropper'
import { toast } from 'sonner'
import { OptimizationDialog } from '@/features/profile/components/optimization-dialog'
import { UploadProgress } from './upload-progress'

// IMPORTAR EL COMPONENTE DE PROGRESO UNIFICADO

interface AvatarOption {
  id: string
  url: string
  provider: string
  label: string
  icon: string
  isCurrentlyUsed?: boolean
}

interface BannerOption {
  id: string
  url: string
  provider: string
  label: string
  icon: string
  isCurrentlyUsed?: boolean
  fileName?: string
  size?: number
  uploadedAt?: string
}

interface PresetOption {
  id: string | number
  url: string
  name: string
  icon?: string
}

interface MediaSelectorProps {
  type: MediaType
  currentUrl: string | null
  presets?: PresetOption[]
  onUpdate: (url: string | null) => void
  triggerButton?: React.ReactNode
  title?: string
  description?: string
  allowRemove?: boolean
  className?: string
  loadApiAvatars?: boolean
  userEmail?: string
}

const PresetItem = memo(({
  option,
  type,
  isLoading,
  onSelect
}: {
  option: PresetOption
  type: MediaType
  isLoading: boolean
  onSelect: (url: string) => void
}) => {
  return (
    <button
      className={`relative rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors group disabled:opacity-50 disabled:cursor-not-allowed ${type === 'avatar' ? 'aspect-square' : 'aspect-[2/1]'
        }`}
      onClick={() => onSelect(option.url)}
      disabled={isLoading}
    >
      {type === 'avatar' ? (
        <Avatar className="w-full h-full">
          <AvatarImage
            src={option.url}
            alt={option.name}
            loading="lazy"
          />
          <AvatarFallback className="text-xs">
            {option.icon || option.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ) : (
        <img
          src={option.url}
          alt={option.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
        {option.name}
      </div>
    </button>
  )
})

PresetItem.displayName = 'PresetItem'

export function MediaSelector({
  type,
  currentUrl,
  presets = [],
  onUpdate,
  triggerButton,
  title,
  description,
  allowRemove = true,
  className = '',
  loadApiAvatars = false,
  userEmail,
}: MediaSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [apiAvatars, setApiAvatars] = useState<AvatarOption[]>([])
  const [apiBanners, setApiBanners] = useState<BannerOption[]>([]) // ← NUEVO
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false)
  const [isLoadingBanners, setIsLoadingBanners] = useState(false) // ← NUEVO
  const [avatarLoadError, setAvatarLoadError] = useState<string | null>(null)
  const [bannerLoadError, setBannerLoadError] = useState<string | null>(null) // ← NUEVO

  const mediaUpload = useMediaUpload({
    type,
    onSuccess: (url) => {
      onUpdate(url)
      setIsDialogOpen(false)
    },
    onError: (error) => {
      console.error(`Error uploading ${type}:`, error)
      toast.error(`Error al subir ${type}. Inténtalo de nuevo.`)
    },
    autoRevalidate: true
  })

  const loadBannerOptions = useCallback(async () => {
    if (type !== 'banner') return

    setIsLoadingBanners(true)
    setBannerLoadError(null)

    try {
      const response = await fetch('/api/banners')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.success && data.options) {
        setApiBanners(data.options)
      } else {
        throw new Error('Formato de respuesta inválido')
      }
    } catch (error) {
      console.error('Error loading banner options:', error)
      setBannerLoadError(
        error instanceof Error
          ? error.message
          : 'Error desconocido cargando banners'
      )
      toast.error('Error cargando opciones de banner')
    } finally {
      setIsLoadingBanners(false)
    }
  }, [type])

  const loadAvatarOptions = useCallback(async () => {
    if (!loadApiAvatars || type !== 'avatar') return

    setIsLoadingAvatars(true)
    setAvatarLoadError(null)

    try {
      const response = await fetch('/api/avatars')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.success && data.options) {
        setApiAvatars(data.options)
      } else {
        throw new Error('Formato de respuesta inválido')
      }
    } catch (error) {
      console.error('Error loading avatar options:', error)
      setAvatarLoadError(
        error instanceof Error
          ? error.message
          : 'Error desconocido cargando avatares'
      )
      toast.error('Error cargando opciones de avatar')
    } finally {
      setIsLoadingAvatars(false)
    }
  }, [loadApiAvatars, type])

  useEffect(() => {
    if (!isDialogOpen) return
    if (isDialogOpen && loadApiAvatars && apiAvatars.length === 0 && !avatarLoadError) {
      loadAvatarOptions()
    }
    if (type === 'banner' && apiBanners.length === 0 && !bannerLoadError) {
      loadBannerOptions()
    }
  }, [isDialogOpen, loadAvatarOptions, loadBannerOptions, loadApiAvatars, apiAvatars.length, avatarLoadError, apiBanners.length, bannerLoadError])

  const allOptions = useMemo(() => {
    let combinedOptions = [...presets]

    if (type === 'avatar' && apiAvatars.length > 0) {
      const apiAsPresets = apiAvatars.map(avatar => ({
        id: avatar.id,
        url: avatar.url,
        name: avatar.label,
        icon: avatar.icon
      }))
      combinedOptions.push(...apiAsPresets)
    }

    if (type === 'banner' && apiBanners.length > 0) {
      const bannersAsPresets = apiBanners.map(banner => ({
        id: banner.id,
        url: banner.url,
        name: banner.label,
        icon: banner.icon
      }))
      combinedOptions = [...bannersAsPresets, ...combinedOptions]
    }

    return combinedOptions
  }, [presets, apiAvatars, apiBanners, type])

  const defaultTitle = type === 'avatar' ? 'Cambiar Avatar' : 'Cambiar Banner'
  const defaultDescription =
    type === 'avatar'
      ? 'Selecciona una nueva imagen para tu avatar'
      : 'Selecciona una nueva imagen para tu banner'

  const handleRemove = useCallback(async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar tu ${type}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/upload`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        onUpdate(null)
        setIsDialogOpen(false)
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado correctamente.`)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${response.status}`)
      }
    } catch (error) {
      console.error(`Error removing ${type}:`, error)
      toast.error(`Error al eliminar ${type}. Inténtalo de nuevo.`)
    }
  }, [type, onUpdate])

  const renderPreview = useCallback(() => {
    const previewUrl = mediaUpload.getCurrentPreview() || currentUrl

    if (type === 'avatar') {
      return (
        <div className="relative">
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage src={previewUrl || undefined} />
            <AvatarFallback>
              <Image className="w-8 h-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>
      )
    }

    return (
      <div className="w-full h-32 rounded-lg overflow-hidden bg-muted relative">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
    )
  }, [mediaUpload, currentUrl, type])

  const defaultTrigger = (
    <Button variant="outline" className={className}>
      <Image className="w-4 h-4 mr-2" />
      {defaultTitle}
    </Button>
  )

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {triggerButton || defaultTrigger}
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title || defaultTitle}</DialogTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </DialogHeader>

          <div className="space-y-6">
            {/* Vista previa */}
            <div className="text-center">
              {renderPreview()}
              <p className="text-sm text-muted-foreground mt-2">Vista previa</p>
            </div>

            {/* Opciones de carga */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={mediaUpload.openFileSelector}
                disabled={mediaUpload.isUploading || mediaUpload.isCropperOpen || mediaUpload.showCropDialog}
              >
                <Upload className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">Seleccionar Archivo</div>
                  <div className="text-sm text-muted-foreground">
                    Desde tu dispositivo
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={mediaUpload.openCamera}
                disabled={mediaUpload.isUploading || mediaUpload.isCropperOpen || mediaUpload.showCropDialog}
              >
                <Camera className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">Tomar Foto</div>
                  <div className="text-sm text-muted-foreground">Usar cámara</div>
                </div>
              </Button>
            </div>

            {/* AQUÍ APLICAR EL COMPONENTE DE PROGRESO UNIFICADO */}
            {(mediaUpload.isUploading || mediaUpload.uploadProgress > 0) && (
              <UploadProgress
                progress={mediaUpload.uploadProgress}
                isUploading={mediaUpload.isUploading}
                fileName={mediaUpload.selectedFile?.name || mediaUpload.capturedFile?.file.name}
                fileSize={mediaUpload.selectedFile?.size ? `${(mediaUpload.selectedFile.size / 1024 / 1024).toFixed(1)} MB` : undefined}
                onCancel={mediaUpload.cancelUpload}
                success={mediaUpload.uploadProgress === 100 && !mediaUpload.isUploading}
                className="my-4"
              />
            )}

            {/* Opciones predefinidas */}
            {(allOptions.length > 0 || isLoadingAvatars || isLoadingBanners) && (
              <div>
                <h4 className="font-medium mb-3">
                  {type === 'avatar' ? 'Avatares Disponibles' : 'Banners Disponibles'}
                </h4>

                {/* Error de avatares */}
                {avatarLoadError && type === 'avatar' && (
                  <Alert className="mb-3">
                    <AlertDescription>
                      {avatarLoadError}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={loadAvatarOptions}
                        className="p-0 h-auto ml-2"
                      >
                        Reintentar
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error de banners */}
                {bannerLoadError && type === 'banner' && (
                  <Alert className="mb-3">
                    <AlertDescription>
                      {bannerLoadError}
                      <Button
                        variant="link"
                        size="sm"
                        onClick={loadBannerOptions}
                        className="p-0 h-auto ml-2"
                      >
                        Reintentar
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Loading states */}
                {(isLoadingAvatars || isLoadingBanners) && (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 mx-auto animate-spin rounded-full border-2 border-current border-t-transparent mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cargando {type === 'avatar' ? 'avatares' : 'banners'}...
                    </p>
                  </div>
                )}

                {/* Opciones */}
                {allOptions.length > 0 && (
                  <div
                    className={`grid gap-2 max-h-60 overflow-y-auto ${type === 'avatar'
                        ? 'grid-cols-4 sm:grid-cols-6'
                        : 'grid-cols-2 sm:grid-cols-3'
                      }`}
                  >
                    {allOptions.map((option) => (
                      <PresetItem
                        key={option.id}
                        option={option}
                        type={type}
                        isLoading={mediaUpload.isUploading || mediaUpload.isCropperOpen || mediaUpload.showCropDialog}
                        onSelect={mediaUpload.usePreset}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Botones de acción */}
            <div className="flex justify-between gap-3">
              {allowRemove && currentUrl && (
                <Button
                  variant="outline"
                  onClick={handleRemove}
                  disabled={mediaUpload.isUploading || mediaUpload.isCropperOpen || mediaUpload.showCropDialog}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              )}

              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    mediaUpload.resetState()
                    setIsDialogOpen(false)
                  }}
                  disabled={mediaUpload.isUploading || mediaUpload.isCropperOpen || mediaUpload.showCropDialog}
                >
                  Cancelar
                </Button>

                {mediaUpload.hasSelectedFile && !mediaUpload.isCropperOpen && !mediaUpload.showCropDialog && (
                  <Button
                    onClick={mediaUpload.uploadSelectedFile}
                    disabled={mediaUpload.isUploading}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {mediaUpload.isFromCamera ? 'Usar Foto' : 'Subir Archivo'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <input {...mediaUpload.fileInputProps} />
        </DialogContent>
      </Dialog>

      <CameraComponent {...mediaUpload.cameraProps} />

      {mediaUpload.isCropperOpen && (
        <ImageCropper {...mediaUpload.cropperProps} />
      )}

      <OptimizationDialog
        isOpen={mediaUpload.showCropDialog}
        onDecision={mediaUpload.handleOptimizationDecision}
        onClose={mediaUpload.handleOptimizationDialogClose}
        imageFile={mediaUpload.pendingFile}
        type={type}
        maxWidth={mediaUpload.resolvedValidationOptions.maxWidth}
        maxHeight={mediaUpload.resolvedValidationOptions.maxHeight}
      />
    </>
  )
}