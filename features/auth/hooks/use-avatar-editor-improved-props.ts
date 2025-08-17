import { AvatarOption } from '@/features/account/types'
import { useState, useCallback, useRef } from 'react'
import { toast } from "sonner"


interface UseAvatarEditorImprovedProps {
  currentAvatar: string | null
  userEmail: string
  onAvatarUpdate: (newAvatarUrl: string | null) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onClose: () => void
}

export function useAvatarEditorImproved({
  currentAvatar,
  userEmail,
  onAvatarUpdate,
  fileInputRef,
  onClose
}: UseAvatarEditorImprovedProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [avatarOptions, setAvatarOptions] = useState<AvatarOption[]>([])
  const [optionsCache, setOptionsCache] = useState<{ data: AvatarOption[], timestamp: number } | null>(null)
  
  // Cache por 5 minutos
  const CACHE_DURATION = 5 * 60 * 1000
  const abortControllerRef = useRef<AbortController | null>(null)

  const getDefaultAvatar = useCallback(() => {
    return `https://api.dicebear.com/9.x/initials/svg?seed=${userEmail}`
  }, [userEmail])

  const loadAvatarOptions = useCallback(async () => {
    // Verificar cache
    if (optionsCache && (Date.now() - optionsCache.timestamp) < CACHE_DURATION) {
      setAvatarOptions(optionsCache.data)
      
      // Verificar avatar actual
      if (currentAvatar) {
        const matchingOption = optionsCache.data.find(option => option.url === currentAvatar)
        if (matchingOption) {
          setSelectedOption(matchingOption.id)
        }
      }
      return
    }

    setIsLoadingOptions(true)
    
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/user/avatar/options', {
        signal: abortControllerRef.current.signal
      })

      if (response.ok) {
        const data = await response.json()
        const options = data.options || []
        
        // Actualizar cache
        setOptionsCache({
          data: options,
          timestamp: Date.now()
        })
        
        setAvatarOptions(options)

        // Verificar avatar actual
        if (currentAvatar) {
          const matchingOption = options.find((option: AvatarOption) =>
            option.url === currentAvatar
          )
          if (matchingOption) {
            setSelectedOption(matchingOption.id)
          }
        }

        if (options.length > 0) {
          toast.success(`${options.length} opciones de avatar cargadas`)
        }
      } else {
        throw new Error('Error al cargar opciones de avatar')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Petición cancelada
      }
      
      console.error('Error loading avatar options:', error)
      toast.error('Error al cargar opciones de avatar')
    } finally {
      setIsLoadingOptions(false)
    }
  }, [currentAvatar, optionsCache, CACHE_DURATION])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validaciones
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no soportado. Usa JPG, PNG, GIF o WebP')
      return
    }

    setSelectedFile(file)
    setSelectedOption(null)

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.onerror = () => {
      toast.error('Error al leer el archivo')
    }
    reader.readAsDataURL(file)
  }, [])

  const handleOptionSelect = useCallback((optionId: string) => {
    setSelectedOption(optionId)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [fileInputRef])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', 'avatar')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al subir la imagen')
      }

      const data = await response.json()

      // Actualizar avatar en la base de datos
      const updateResponse = await fetch('/api/user/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarUrl: data.url
        }),
      })

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar el avatar')
      }

      // Invalidar cache para forzar recarga
      setOptionsCache(null)
      
      onAvatarUpdate(data.url)
      toast.success('Avatar personalizado subido correctamente')
      onClose()
      resetState()

    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el avatar')
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, onAvatarUpdate, onClose])

  const useSelectedOption = useCallback(async () => {
    if (!selectedOption) return

    const option = avatarOptions.find(opt => opt.id === selectedOption)
    if (!option) return

    setIsUploading(true)

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarUrl: option.url
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al actualizar el avatar')
      }

      onAvatarUpdate(option.url)
      toast.success(`Avatar de ${option.provider} actualizado`)
      onClose()
      resetState()

    } catch (error) {
      console.error('Error updating avatar:', error)
      toast.error(error instanceof Error ? error.message || 'Error al actualizar el avatar' : 'Error al actualizar el avatar')
    } finally {
      setIsUploading(false)
    }
  }, [selectedOption, avatarOptions, onAvatarUpdate, onClose])

  const removeAvatar = useCallback(async () => {
    setIsUploading(true)

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al remover el avatar')
      }

      onAvatarUpdate(null)
      toast.success('Avatar removido')
      onClose()
      resetState()

    } catch (error) {
      console.error('Error removing avatar:', error)
      toast.error(error instanceof Error ? error.message : 'Error al remover el avatar')
    } finally {
      setIsUploading(false)
    }
  }, [onAvatarUpdate, onClose])

  const resetState = useCallback(() => {
    setPreviewUrl(null)
    setSelectedFile(null)
    setSelectedOption(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [fileInputRef])

  const getCurrentPreview = useCallback(() => {
    if (previewUrl) return previewUrl
    if (selectedOption) {
      const option = avatarOptions.find(opt => opt.id === selectedOption)
      return option?.url
    }
    return currentAvatar
  }, [previewUrl, selectedOption, avatarOptions, currentAvatar])

  const invalidateCache = useCallback(() => {
    setOptionsCache(null)
  }, [])

  return {
    isUploading,
    isLoadingOptions,
    previewUrl,
    selectedFile,
    selectedOption,
    avatarOptions,
    setSelectedFile,
    setSelectedOption,
    setPreviewUrl,
    loadAvatarOptions,
    handleFileSelect,
    handleOptionSelect,
    handleUpload,
    useSelectedOption,
    removeAvatar,
    resetState,
    getCurrentPreview,
    getDefaultAvatar,
    invalidateCache
  }
}