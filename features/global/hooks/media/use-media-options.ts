'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

import { AvatarOption, BannerOption } from '@/features/global/types/media'
import { UseMediaOptionsProps } from '@/features/global/types/media'

export function useMediaOptions({ type, loadApiAvatars }: UseMediaOptionsProps) {
    const [apiAvatars, setApiAvatars] = useState<AvatarOption[]>([])
    const [apiBanners, setApiBanners] = useState<BannerOption[]>([])
    const [isLoadingAvatars, setIsLoadingAvatars] = useState(false)
    const [isLoadingBanners, setIsLoadingBanners] = useState(false)
    const [avatarLoadError, setAvatarLoadError] = useState<string | null>(null)
    const [bannerLoadError, setBannerLoadError] = useState<string | null>(null)

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

    return {
        apiAvatars,
        apiBanners,
        isLoadingAvatars,
        isLoadingBanners,
        avatarLoadError,
        bannerLoadError,
        loadAvatarOptions,
        loadBannerOptions,
    }
}