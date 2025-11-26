'use client'

import { useState, useEffect, useMemo, useOptimistic } from 'react'
import { toast } from 'sonner'

import { MediaSelectorTrigger, MediaSelectorContent, MediaSelectorDialogs } from '@/features/global/components/media-selector'
import { useMediaOptions } from '@/features/global/hooks/media/use-media-options'
import { useMediaUpload } from '@/features/global/hooks/media/use-media-upload'
import { MediaSelectorProps, PresetOption, UPLOAD_TYPES } from '@/features/global/types/media'
import { getMediaConfig } from '@/features/global/types/media'
import { removeMedia } from '@/features/global/utils/media/remove-media'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/features/shadcn/components/ui/dialog'

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
  storeId, // ✅ Agregar
  productId, // ✅ Agregar
}: MediaSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [/* optimisticUrl */, setOptimisticUrl] = useOptimistic(currentUrl)

  // ✅ Obtener configuración automática
  const config = getMediaConfig(type)

  // ✅ Título y descripción por defecto según tipo
  const getDefaultContent = () => {
    switch (type) {
      case UPLOAD_TYPES.AVATAR:
        return { title: 'Cambiar Avatar', description: 'Seleccioná una nueva imagen para tu avatar' }
      case UPLOAD_TYPES.BANNER:
        return { title: 'Cambiar Banner', description: 'Seleccioná una nueva imagen para tu banner' }
      case UPLOAD_TYPES.STORE_LOGO:
        return { title: 'Cambiar Logo de Tienda', description: 'Seleccioná o subí el logo de tu tienda' }
      case UPLOAD_TYPES.STORE_BANNER:
        return { title: 'Cambiar Banner de Tienda', description: 'Personalizá el banner de tu tienda' }
      case UPLOAD_TYPES.PRODUCT_IMAGE:
        return { title: 'Imagen de Producto', description: 'Subí la imagen principal del producto' }
      case UPLOAD_TYPES.PRODUCT_VIDEO:
        return { title: 'Video de Producto', description: 'Subí un video para mostrar tu producto' }
      default:
        return { title: 'Cambiar Imagen', description: 'Seleccioná una nueva imagen' }
    }
  }

  const defaultContent = getDefaultContent()

  const mediaOptions = useMediaOptions({ type, loadApiAvatars })

  const mediaUpload = useMediaUpload({
    type,
    validationOptions: config,
    onSuccess: (url: string) => {
      onUpdate(url)
      setIsDialogOpen(false)
    },
    onError: (hasError: Error | string) => {
      console.error(`Error uploading ${type}:`, hasError)
      toast.error(`Error al subir ${type}. Inténtalo de nuevo.`)
    },
    autoRevalidate: true,
  })

  // Cargar opciones cuando se abre el diálogo
  useEffect(() => {
    if (!isDialogOpen) return

    // ✅ Cargar avatares solo para avatar y store-logo
    if (
      (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.STORE_LOGO) &&
      loadApiAvatars &&
      mediaOptions.apiAvatars.length === 0 &&
      !mediaOptions.avatarLoadError
    ) {
      mediaOptions.loadAvatarOptions()
    }

    // ✅ Cargar banners para banner y store-banner
    if (
      (type === UPLOAD_TYPES.BANNER || type === UPLOAD_TYPES.STORE_BANNER) &&
      mediaOptions.apiBanners.length === 0 &&
      !mediaOptions.bannerLoadError
    ) {
      mediaOptions.loadBannerOptions()
    }
  }, [isDialogOpen, type, loadApiAvatars, mediaOptions])

  // Combinar opciones de presets con API
  const allOptions = useMemo((): PresetOption[] => {
    // ✅ Banners para banner y store-banner
    if (
      (type === UPLOAD_TYPES.BANNER || type === UPLOAD_TYPES.STORE_BANNER) &&
      mediaOptions.apiBanners.length > 0
    ) {
      return mediaOptions.apiBanners.map((banner) => ({
        id: banner.id,
        url: banner.url,
        name: banner.label,
        icon: banner.icon,
      }))
    }

    // ✅ Avatares para avatar y store-logo
    if (
      (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.STORE_LOGO) &&
      mediaOptions.apiAvatars.length > 0
    ) {
      return mediaOptions.apiAvatars.map((avatar) => ({
        id: avatar.id,
        url: avatar.url,
        name: avatar.label,
        icon: avatar.icon,
      }))
    }

    return [...presets]
  }, [presets, mediaOptions.apiAvatars, mediaOptions.apiBanners, type])

  // ✅ Handler para eliminar media del servidor
  const handleRemove = async () => {
    try {
      // Actualización optimista
      setOptimisticUrl(null)

      // Llamar al endpoint correcto
      await removeMedia(type, {
        showConfirm: false, // Ya mostramos confirmación en el UI
        storeId, // ✅ Pasar storeId
        productId, // ✅ Pasar productId
        onSuccess: () => {
          onUpdate(null)
          setIsDialogOpen(false)

          // ✅ Mensaje contextual según tipo
          const messages = {
            [UPLOAD_TYPES.AVATAR]: 'Avatar eliminado correctamente.',
            [UPLOAD_TYPES.BANNER]: 'Banner eliminado correctamente.',
            [UPLOAD_TYPES.STORE_LOGO]: 'Logo de tienda eliminado correctamente.',
            [UPLOAD_TYPES.STORE_BANNER]: 'Banner de tienda eliminado correctamente.',
            [UPLOAD_TYPES.PRODUCT_IMAGE]: 'Imagen de producto eliminada correctamente.',
          }

          toast.success(messages[type as keyof typeof messages] || 'Imagen eliminada correctamente.')
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
            defaultTitle={title || defaultContent.title}
            className={className}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title || defaultContent.title}</DialogTitle>
            {(description || defaultContent.description) && (
              <p className="text-sm text-muted-foreground">
                {description || defaultContent.description}
              </p>
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