// features/shared/hooks/utils/preview-manager.ts

import React from "react"

/**
 * Gestiona las URLs de preview para evitar memory leaks
 */
export class PreviewManager {
    private activeUrls = new Set<string>()

    /**
     * Crea una preview URL y la registra
     */
    createPreview(file: File): string {
        const url = URL.createObjectURL(file)
        this.activeUrls.add(url)
        return url
    }

    /**
     * Revoca una preview URL específica
     */
    revokePreview(url: string | null | undefined): void {
        if (!url) return

        // Solo revocar URLs de objeto (no URLs externas)
        if (url.startsWith('blob:')) {
            try {
                URL.revokeObjectURL(url)
                this.activeUrls.delete(url)
            } catch (error) {
                // Silenciar errores de URLs ya revocadas
                console.warn('Error revocando URL:', error)
            }
        }
    }

    /**
     * Revoca todas las preview URLs activas
     */
    revokeAll(): void {
        this.activeUrls.forEach(url => {
            try {
                URL.revokeObjectURL(url)
            } catch (error) {
                console.warn('Error revocando URL:', error)
            }
        })
        this.activeUrls.clear()
    }

    /**
     * Obtiene el número de previews activas
     */
    getActiveCount(): number {
        return this.activeUrls.size
    }

    /**
     * Verifica si una URL está activa
     */
    isActive(url: string): boolean {
        return this.activeUrls.has(url)
    }
}

/**
 * Hook para usar PreviewManager
 */
export function usePreviewManager() {
    const managerRef = React.useRef<PreviewManager | null>(null)

    if (!managerRef.current) {
        managerRef.current = new PreviewManager()
    }

    React.useEffect(() => {
        const manager = managerRef.current!
        return () => {
            manager.revokeAll()
        }
    }, [])

    return managerRef.current
}

/**
 * Versión simplificada sin clase (alternativa)
 */
export function createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
}

export function revokePreviewUrl(url: string | null | undefined): void {
    if (!url) return
    if (url.startsWith('blob:')) {
        try {
            URL.revokeObjectURL(url)
        } catch (error) {
            console.warn('Error revocando URL:', error)
        }
    }
}