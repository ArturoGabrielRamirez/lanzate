'use server'

import { AvatarOption } from '@/features/account/types'
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '@/features/global/utils'
import { diceBearStyles } from '@/features/profile/constants'
import { getUserAvatarData, getStorageAvatarsData } from "@/features/profile/data"
import { createServerSideClient } from '@/utils/supabase/server'

export async function getAvatarOptionsAction() {
    return actionWrapper(async () => {
        const supabase = createServerSideClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return formatErrorResponse('No autenticado')
        }

        const dbUser = await getUserAvatarData(user.id)

        if (!dbUser) {
            return formatErrorResponse('Usuario no encontrado')
        }

        const options: AvatarOption[] = []

        // --- 1. Avatares OAuth (Google/Facebook) ---
        const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture
        if (googleAvatar) {
            options.push({
                id: 'google-metadata',
                url: googleAvatar,
                provider: 'Google',
                label: 'Avatar de Google',
                icon: '🟦'
            })
        }

        if (user.identities?.length) {
            for (const identity of user.identities) {
                let avatarUrl: string | null = null
                let label = ''
                let icon = ''

                switch (identity.provider) {
                    case 'google':
                        avatarUrl = identity.identity_data?.avatar_url ||
                            identity.identity_data?.picture ||
                            identity.identity_data?.image_url
                        label = 'Google'
                        icon = '🟦'
                        break
                    case 'facebook':
                        avatarUrl = identity.identity_data?.avatar_url ||
                            identity.identity_data?.picture?.data?.url
                        label = 'Facebook'
                        icon = '📘'
                        break
                }

                if (avatarUrl?.startsWith('http')) {
                    options.push({
                        id: `${identity.provider}-identity`,
                        url: avatarUrl,
                        provider: label,
                        label: `Avatar de ${label}`,
                        icon
                    })
                }
            }
        }

        // --- 2. Avatares personalizados en Storage ---
        const storageAvatars = await getStorageAvatarsData(supabase, dbUser.id)

        for (const avatar of storageAvatars) {
            options.push({
                id: `storage-${avatar.fileName}`,
                url: avatar.url,
                provider: 'Personalizado',
                label: 'Avatar Subido',
                icon: '📸',
                fileName: avatar.fileName,
                size: avatar.size,
                uploadedAt: avatar.uploadedAt
            })
        }

        // --- 3. DiceBear (presets generados) ---
        for (const { style, label, icon } of diceBearStyles) {
            const diceBearUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(dbUser.email)}&backgroundColor=transparent`
            options.push({
                id: `dicebear-${style}`,
                url: diceBearUrl,
                provider: 'DiceBear',
                label: `${label} Generado`,
                icon,
            })
        }

        // --- 4. Eliminar duplicados por URL ---
        const uniqueOptions = options.filter(
            (opt, i, arr) => i === arr.findIndex(o => o.url === opt.url)
        )

        const optionsWithStatus = uniqueOptions.map(opt => ({
            ...opt,
            isCurrentlyUsed: dbUser.avatar === opt.url
        }))

        // Ordenar: avatar actual primero, luego por proveedor
        optionsWithStatus.sort((a, b) => {
            if (a.isCurrentlyUsed && !b.isCurrentlyUsed) return -1
            if (!a.isCurrentlyUsed && b.isCurrentlyUsed) return 1
            const order = ['Google', 'Facebook', 'Personalizado', 'DiceBear']
            return order.indexOf(a.provider) - order.indexOf(b.provider)
        })

        return formatSuccessResponse('Opciones de avatar obtenidas exitosamente', {
            options: optionsWithStatus,
            total: optionsWithStatus.length,
            currentAvatar: dbUser.avatar
        })
    })
}