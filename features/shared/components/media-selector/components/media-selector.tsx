'use client'

import { useState, useEffect, useMemo, useOptimistic } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useMediaUpload } from '@/features/shared/hooks/use-media-upload'
import { useMediaOptions } from '@/features/shared/components/media-selector/hooks/use-media-options'
import { removeMedia } from '@/features/shared/components/media-selector/utils/remove-media'
import { MediaSelectorProps } from '@/features/shared/types'
import { PresetOption } from '@/features/shared/types'
import { MediaSelectorTrigger } from './media-selector-trigger'
import { MediaSelectorContent } from './media-selector-content'
import { MediaSelectorDialogs } from './media-selector-dialogs'

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
}: MediaSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [_optimisticUrl, setOptimisticUrl] = useOptimistic(currentUrl)


  const mediaOptions = useMediaOptions({ type, loadApiAvatars })


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
    autoRevalidate: true,
  })

  // Cargar opciones cuando se abre el diálogo
  useEffect(() => {
    if (!isDialogOpen) return

    if (loadApiAvatars && mediaOptions.apiAvatars.length === 0 && !mediaOptions.avatarLoadError) {
      mediaOptions.loadAvatarOptions()
    }

    if (type === 'banner' && mediaOptions.apiBanners.length === 0 && !mediaOptions.bannerLoadError) {
      mediaOptions.loadBannerOptions()
    }
  }, [isDialogOpen, type, loadApiAvatars, mediaOptions])

  // Combinar opciones de presets con API
  const allOptions = useMemo((): PresetOption[] => {
    if (type === 'banner' && mediaOptions.apiBanners.length > 0) {
      return mediaOptions.apiBanners.map((banner) => ({
        id: banner.id,
        url: banner.url,
        name: banner.label,
        icon: banner.icon,
      }))
    }

    if (type === 'avatar' && mediaOptions.apiAvatars.length > 0) {
      return mediaOptions.apiAvatars.map((avatar) => ({
        id: avatar.id,
        url: avatar.url,
        name: avatar.label,
        icon: avatar.icon,
      }))
    }

    return [...presets]
  }, [presets, mediaOptions.apiAvatars, mediaOptions.apiBanners, type])

  const defaultTitle = type === 'avatar' ? 'Cambiar Avatar' : 'Cambiar Banner'

  // Handler para eliminar media del servidor
  const handleRemove = async () => {
    try {
      // Actualización optimista
      setOptimisticUrl(null)

      // Llamar al endpoint correcto
      await removeMedia(type, {
        showConfirm: false, // Ya mostramos confirmación en el UI
        onSuccess: () => {
          onUpdate(null)
          setIsDialogOpen(false)
          toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} eliminado correctamente.`)
        },
        onError: (error) => {
          // Revertir actualización optimista
          setOptimisticUrl(currentUrl)
          toast.error(`Error al eliminar ${type}: ${error.message}`)
        }
      })
    } catch (error) {
      console.error(`Error removing ${type}:`, error)
      setOptimisticUrl(currentUrl)
      toast.error(`Error al eliminar ${type}. Inténtalo de nuevo.`)
    }
  }

  // Handler para cancelar
  const handleCancel = () => {
    mediaUpload.resetState()
    setIsDialogOpen(false)
  }

  // Estados derivados
  const isActionDisabled =
    mediaUpload.isUploading ||
    mediaUpload.isCropperOpen ||
    mediaUpload.showCropDialog ||
    mediaUpload.showBackgroundRemover

  const showUploadButton =
    mediaUpload.hasSelectedFile &&
    !mediaUpload.isCropperOpen &&
    !mediaUpload.showCropDialog &&
    !mediaUpload.showBackgroundRemover

  const previewUrl = mediaUpload.getCurrentPreview() || currentUrl

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <MediaSelectorTrigger
            triggerButton={triggerButton}
            defaultTitle={defaultTitle}
            className={className}
          />
        </DialogTrigger>

        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title || defaultTitle}</DialogTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </DialogHeader>

          <MediaSelectorContent
            type={type}
            previewUrl={previewUrl}
            currentUrl={currentUrl}
            allOptions={allOptions}
            mediaOptions={mediaOptions}
            mediaUpload={mediaUpload}
            allowRemove={allowRemove}
            isActionDisabled={isActionDisabled}
            showUploadButton={showUploadButton}
            onRemove={handleRemove}
            onCancel={handleCancel}
          />

          <input {...mediaUpload.fileInputProps} />
        </DialogContent>
      </Dialog>

      <MediaSelectorDialogs
        type={type}
        mediaUpload={mediaUpload}
      />
    </>
  )
}