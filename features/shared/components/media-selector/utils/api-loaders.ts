// features/shared/utils/api-loaders.ts (o media-api.ts)

/* import { AvatarOption, BannerOption, MediaType } from '@/features/shared/types' */

/**
 * Carga las opciones de avatares desde la API
 */
/* export async function loadAvatarOptions(): Promise<AvatarOption[]> {
    try {
        const response = await fetch('/api/avatars')

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.error) {
            throw new Error(data.error)
        }

        if (!data.success || !data.options) {
            throw new Error('Formato de respuesta inválido')
        }

        return data.options as AvatarOption[]
    } catch (error) {
        console.error('Error in loadAvatarOptions:', error)
        throw error
    }
} */

/**
 * Carga las opciones de banners desde la API
 */
/* export async function loadBannerOptions(): Promise<BannerOption[]> {
    try {
        const response = await fetch('/api/banners')

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.error) {
            throw new Error(data.error)
        }

        if (!data.success || !data.options) {
            throw new Error('Formato de respuesta inválido')
        }

        return data.options as BannerOption[]
    } catch (error) {
        console.error('Error in loadBannerOptions:', error)
        throw error
    }
}
 */
/**
 * Sube un archivo al servidor
 */
/* export async function uploadMediaFile(
    file: File,
    type: MediaType,
    options?: {
        onProgress?: (progress: number) => void
        signal?: AbortSignal
    }
): Promise<string> {
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        options?.onProgress?.(10)

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            signal: options?.signal
        })

        options?.onProgress?.(60)

        if (!response.ok) {
            let errorMessage = `Error al subir ${type}`
            try {
                const errorData = await response.json()
                errorMessage = errorData.error || errorMessage
            } catch { }
            throw new Error(errorMessage)
        }

        const data = await response.json()
        options?.onProgress?.(90)

        if (!data.url) {
            throw new Error('No se recibió URL del archivo subido')
        }

        options?.onProgress?.(100)
        return data.url
    } catch (error) {
        console.error('Error in uploadMediaFile:', error)
        throw error
    }
}
 */
/**
 * Actualiza media usando una URL preset
 */
/* export async function uploadMediaPreset(
    presetUrl: string,
    type: MediaType,
    options?: {
        onProgress?: (progress: number) => void
    }
): Promise<string> {
    try {
        options?.onProgress?.(20)

        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, presetUrl })
        })

        options?.onProgress?.(70)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Error al actualizar ${type}`)
        }

        const data = await response.json()
        options?.onProgress?.(100)

        return data.url || presetUrl
    } catch (error) {
        console.error('Error in uploadMediaPreset:', error)
        throw error
    }
} */

/**
 * Elimina un media (avatar o banner) del usuario
 */
/* export async function removeMedia(
    type: MediaType,
    options?: {
        onSuccess?: () => void
        onError?: (error: Error) => void
        showConfirm?: boolean
    }
): Promise<void> {
    try {
        // Confirmación opcional
        if (options?.showConfirm !== false) {
            if (!window.confirm(`¿Estás seguro de que quieres eliminar tu ${type}?`)) {
                return
            }
        }

        const response = await fetch('/api/upload/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(
                errorData.error || `Error ${response.status}: ${response.statusText}`
            )
        }

        const data = await response.json()

        if (data.error) {
            throw new Error(data.error)
        }

        // Callback de éxito
        options?.onSuccess?.()
    } catch (error) {
        console.error('Error in removeMedia:', error)
        const err = error instanceof Error ? error : new Error(String(error))
        options?.onError?.(err)
        throw err
    }
}
 */
/**
 * Valida que una URL de preset sea válida
 */
export function validatePresetUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * Formatea el nombre de un tipo de media para display
 */
/* export function formatMediaType(type: MediaType): string {
    return type.charAt(0).toUpperCase() + type.slice(1)
}
 */
/* export function cancelDeletion(
    reason?: string,
    headers?: HeadersInit,
    baseUrl?: string
) {
    return fetch(`${baseUrl}/api/user/cancel-deletion`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason }),
    })
} */