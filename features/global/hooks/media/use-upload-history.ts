'use client'

import { useState, useEffect, useCallback } from 'react'

import { toast } from 'sonner'

import { deleteMediaAction } from '../../actions/media/delete-media-action'
import { getUserUploadsAction } from '../../actions/media/get-user-uploads-action'

export function useUploadHistory(type: 'avatar' | 'banner') {
    const [uploads, setUploads] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const MAX_UPLOADS = 4

    // Cargar uploads al montar
    useEffect(() => {
        loadUploads()
    }, [type])

    const loadUploads = useCallback(async () => {
        setIsLoading(true)
        try {
            const result = await getUserUploadsAction({ type })

            if (result.error) {
                console.error('Error loading uploads:', result.message)
                return
            }

            setUploads(result.payload?.uploads || [])
        } catch (error) {
            console.error('Error loading uploads:', error)
        } finally {
            setIsLoading(false)
        }
    }, [type])

    const addUpload = useCallback((url: string) => {
        setUploads(prev => {
            if (prev.includes(url)) return prev
            const newUploads = [url, ...prev]
            return newUploads.slice(0, MAX_UPLOADS)
        })
    }, [])

    const removeUpload = useCallback(async (url: string) => {
        const loadingToast = toast.loading('Eliminando...')

        try {
            const result = await deleteMediaAction({ type, mediaUrl: url })

            if (result.error) {
                toast.error(result.message, { id: loadingToast })
                return
            }

            setUploads(prev => prev.filter(u => u !== url))
            toast.success('Eliminado correctamente', { id: loadingToast })
        } catch (error) {
            console.error('Error removing upload:', error)
            toast.error('Error al eliminar', { id: loadingToast })
        }
    }, [type])

    const canUploadMore = uploads.length < MAX_UPLOADS

    return {
        uploads,
        isLoading,
        canUploadMore,
        remainingSlots: MAX_UPLOADS - uploads.length,
        addUpload,
        removeUpload,
        reload: loadUploads
    }
}