'use server'

import { BannerOption } from '@/features/account/types'
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '@/features/global/utils'
import { getUserBannerData, getStorageBanners } from "@/features/profile/data/get-banner-options"
import { PRESET_BANNERS } from '@/features/profile/utils/preset-banners'
import { createServerSideClient } from '@/utils/supabase/server'

export async function getBannerOptionsAction() {
    return actionWrapper(async () => {
        const supabase = createServerSideClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return formatErrorResponse('No autenticado')
        }

        const dbUser = await getUserBannerData(user.id)

        if (!dbUser) {
            return formatErrorResponse('Usuario no encontrado')
        }

        const options: BannerOption[] = []

        // --- 1. Banners personalizados subidos por el usuario ---
        const storageBanners = await getStorageBanners(supabase, dbUser.id)

        for (const banner of storageBanners) {
            options.push({
                id: `storage-${banner.fileName}`,
                url: banner.url,
                provider: 'Personalizado',
                label: 'Banner Subido',
                icon: '📸',
                fileName: banner.fileName,
                size: banner.size,
                uploadedAt: banner.uploadedAt
            })
        }

        // --- 2. Banners predefinidos ---
        for (const preset of PRESET_BANNERS) {
            options.push({
                id: `preset-${preset.id}`,
                url: preset.url,
                provider: 'Predefinido',
                label: preset.name,
                icon: '🖼️'
            })
        }

        // --- 3. Eliminar duplicados por URL ---
        const uniqueOptions = options.filter(
            (opt, i, arr) => i === arr.findIndex(o => o.url === opt.url)
        )

        const optionsWithStatus = uniqueOptions.map(opt => ({
            ...opt,
            isCurrentlyUsed: dbUser.banner === opt.url
        }))

        // --- 4. Ordenar: banner actual primero, luego personalizados, luego predefinidos ---
        optionsWithStatus.sort((a, b) => {
            if (a.isCurrentlyUsed && !b.isCurrentlyUsed) return -1
            if (!a.isCurrentlyUsed && b.isCurrentlyUsed) return 1
            const order = ['Personalizado', 'Predefinido']
            return order.indexOf(a.provider) - order.indexOf(b.provider)
        })

        return formatSuccessResponse('Opciones de banner obtenidas exitosamente', {
            options: optionsWithStatus,
            total: optionsWithStatus.length,
            currentBanner: dbUser.banner
        })
    })
}