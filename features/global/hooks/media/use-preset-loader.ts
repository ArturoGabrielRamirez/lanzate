/* 
import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import type { UsePresetLoaderProps, UsePresetLoaderReturn } from '../types'
import { loadAvatarOptions, loadBannerOptions } from '../utils/api-loaders'
import { AvatarOption, BannerOption } from '@/features/shared/types'

export function usePresetLoader({
  type,
  loadApiAvatars = false,
  presets = [],
  isDialogOpen
}: UsePresetLoaderProps): UsePresetLoaderReturn {
  const [apiAvatars, setApiAvatars] = useState<AvatarOption[]>([])
  const [apiBanners, setApiBanners] = useState<BannerOption[]>([])
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false)
  const [isLoadingBanners, setIsLoadingBanners] = useState(false)
  const [avatarLoadError, setAvatarLoadError] = useState<string | null>(null)
  const [bannerLoadError, setBannerLoadError] = useState<string | null>(null)

  const loadBanners = useCallback(async () => {
    if ((type) !== 'banner') return

    setIsLoadingBanners(true)
    setBannerLoadError(null)

    try {
      const options = await loadBannerOptions()
      setApiBanners(options)
    } catch (error) {
      console.error('Error loading banner options:', error)
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error desconocido cargando banners'

      setBannerLoadError(errorMessage)
      toast.error('Error cargando opciones de banner')
    } finally {
      setIsLoadingBanners(false)
    }
  }, [type])

 
  const loadAvatars = useCallback(async () => {
    if (!loadApiAvatars || (type) !== 'avatar') return

    setIsLoadingAvatars(true)
    setAvatarLoadError(null)

    try {
      const options = await loadAvatarOptions()
      setApiAvatars(options)
    } catch (error) {
      console.error('Error loading avatar options:', error)
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error desconocido cargando avatares'

      setAvatarLoadError(errorMessage)
      toast.error('Error cargando opciones de avatar')
    } finally {
      setIsLoadingAvatars(false)
    }
  }, [loadApiAvatars, type])

 
  useEffect(() => {
    if (!isDialogOpen) return

    // Cargar avatares si es necesario
    if (loadApiAvatars && apiAvatars.length === 0 && !avatarLoadError) {
      loadAvatars()
    }

    // Cargar banners si es necesario
    if ((type) === 'banner' && apiBanners.length === 0 && !bannerLoadError) {
      loadBanners()
    }
  }, [
    isDialogOpen,
    loadAvatars,
    loadBanners,
    loadApiAvatars,
    apiAvatars.length,
    avatarLoadError,
    apiBanners.length,
    bannerLoadError,
    type
  ])

  const allOptions = useMemo(() => {
    // Para banners: usar opciones de API si están disponibles
    if ((type) === 'banner' && apiBanners.length > 0) {
      return apiBanners.map(banner => ({
        id: banner.id,
        url: banner.url,
        name: banner.label,
        icon: banner.icon
      }))
    }

    // Para avatares: usar opciones de API si están disponibles
    if ((type) === 'avatar' && apiAvatars.length > 0) {
      return apiAvatars.map(avatar => ({
        id: avatar.id,
        url: avatar.url,
        name: avatar.label,
        icon: avatar.icon
      }))
    }

    // Fallback: usar presets locales
    return [...presets]
  }, [presets, apiAvatars, apiBanners, type])

  return {
    allOptions,
    isLoadingAvatars,
    isLoadingBanners,
    avatarLoadError,
    bannerLoadError,
    reloadAvatars: loadAvatars,
    reloadBanners: loadBanners
  }
} */