'use client'

import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'

import { updateMediaPresetAction } from '@/features/global/actions/media/update-media-preset-action'
import type { UploadMethod, UseFileUploadProps } from '@/features/global/types/media'

export function useFileUpload({ type, onSuccess, onError }: UseFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoadingPreset, setIsLoadingPreset] = useState(false) // ← NUEVO
  const abortControllerRef = useRef<AbortController | null>(null)

  const uploadFile = useCallback(
    async (file: File, method: UploadMethod = 'file') => {
      setIsUploading(true)
      setUploadProgress(0)

      abortControllerRef.current = new AbortController()

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        setUploadProgress(10)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal,
        })

        setUploadProgress(60)

        if (!response.ok) {
          let errorMessage = `Error al subir ${type}`
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch { }
          throw new Error(errorMessage)
        }

        const data = await response.json()
        setUploadProgress(90)

        if (!data.url) {
          throw new Error('No se recibió URL del archivo subido')
        }

        setUploadProgress(100)

        toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} subido correctamente`)

        setTimeout(() => {
          onSuccess?.(data.url, method)
        }, 500)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          toast.info('Subida cancelada')
          return
        }

        console.error('Error uploading file:', error)
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        onError?.(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsUploading(false)
        abortControllerRef.current = null
      }
    },
    [type, onSuccess, onError]
  )

  // ✅ ACTUALIZADO: usePreset con loading states y progress
  const usePreset = useCallback(
    async (presetUrl: string) => {
      setIsLoadingPreset(true) // ← Marca que está cargando un preset
      setUploadProgress(10)    // ← Progreso inicial

      try {
        setUploadProgress(30) // Preparando petición

        const result = await updateMediaPresetAction({ type, presetUrl })

        setUploadProgress(70) // Procesando respuesta

        if (result.hasError) {
          throw new Error(result.message)
        }

        setUploadProgress(100) // Completado

        toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} actualizado`)

        // Pequeño delay para mostrar el 100%
        await new Promise(resolve => setTimeout(resolve, 500))

        onSuccess?.(presetUrl, 'preset')
      } catch (error) {
        console.error('Error using preset:', error)
        const errorMessage = error instanceof Error ? error.message : 'Error al usar preset'
        onError?.(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoadingPreset(false) // ← Limpia el loading state
        setUploadProgress(0)       // ← Reset del progreso
      }
    },
    [type, onSuccess, onError]
  )

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  return {
    isUploading,
    uploadProgress,
    isLoadingPreset,  // ← NUEVO: exportar el estado
    uploadFile,
    usePreset,
    cancelUpload,
  }
}