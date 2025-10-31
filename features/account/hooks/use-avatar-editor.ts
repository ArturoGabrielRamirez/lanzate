/* import { useState, useCallback, useRef } from 'react'
import { toast } from "sonner"
import { AvatarOption } from '@/features/account/types'
import { removeMedia } from '@/features/shared/components/media-selector/utils/remove-media'

interface UseAvatarEditorProps {
  currentAvatar: string | null
  userEmail: string
  onAvatarUpdate: (newAvatarUrl: string | null) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onClose: () => void
}

export function useAvatarEditor({
  currentAvatar,
  userEmail,
  onAvatarUpdate,
  fileInputRef,
  onClose
}: UseAvatarEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [avatarOptions, setAvatarOptions] = useState<AvatarOption[]>([])
  const [optionsCache, setOptionsCache] = useState<{ data: AvatarOption[], timestamp: number } | null>(null)

  // Cache por 10 minutos
  const CACHE_DURATION = 10 * 60 * 1000
  const abortControllerRef = useRef<AbortController | null>(null)

  const getDefaultAvatar = useCallback(() => {
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userEmail)}&backgroundColor=transparent`
  }, [userEmail])

  const loadAvatarOptions = useCallback(async () => {
    // Verificar cache
    if (optionsCache && (Date.now() - optionsCache.timestamp) < CACHE_DURATION) {
      setAvatarOptions(optionsCache.data)
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
      const response = await fetch('/api/avatars', {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error en la respuesta del servidor')
      }

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
        } else {
          console.warn('⚠️ Avatar actual no encontrado en las opciones disponibles')
        }
      }

      if (options.length > 0) {
        toast.success(`${options.length} opciones de avatar cargadas`)
      } else {
        toast.info('No se encontraron opciones de avatar adicionales')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      console.error('❌ Error loading avatar options:', error)

      // En caso de error, cargar avatar básico
      const fallbackOptions = [
        {
          id: 'dicebear-initials',
          url: getDefaultAvatar(),
          provider: 'DiceBear',
          label: 'Iniciales Generadas',
          icon: '🔤'
        }
      ]
      setAvatarOptions(fallbackOptions)
    } finally {
      setIsLoadingOptions(false)
    }
  }, [currentAvatar, optionsCache, CACHE_DURATION, getDefaultAvatar])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`La imagen debe ser menor a ${maxSize / 1024 / 1024}MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return
    }

    // Validar formato
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
      const result = e.target?.result as string
      setPreviewUrl(result)
    }
    reader.onerror = () => {
      console.error('❌ Error leyendo archivo')
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

  // ✅ DECLARAR resetState ANTES de usarlo
  const resetState = useCallback(() => {
    setPreviewUrl(null)
    setSelectedFile(null)
    setSelectedOption(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [fileInputRef])

  // SUBIR ARCHIVO PERSONALIZADO
  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      toast.error('No hay archivo seleccionado')
      return
    }

    setIsUploading(true)
    try {
      // Crear FormData
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', 'avatar')

      // Subir archivo al nuevo endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error HTTP ${response.status}`)
      }

      const data = await response.json()

      // El nuevo endpoint ya actualiza la BD automáticamente
      // Solo necesitas invalidar cache y actualizar estado
      setOptionsCache(null)
      onAvatarUpdate(data.url)
      toast.success('Avatar personalizado subido correctamente')
      onClose()
      resetState()
    } catch (error: unknown) {
      console.error('❌ Error uploading avatar:', error)
      toast.error(`Error subiendo avatar: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, onAvatarUpdate, onClose, resetState])

  // USAR OPCIÓN PREDEFINIDA (PRESET)
  const useSelectedOption = useCallback(async () => {
    if (!selectedOption) {
      toast.error('No hay opción seleccionada')
      return
    }

    const option = avatarOptions.find(opt => opt.id === selectedOption)
    if (!option) {
      toast.error('Opción no encontrada')
      return
    }

    setIsUploading(true)
    try {
      // Usar preset con el nuevo endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'avatar',
          presetUrl: option.url
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error HTTP ${response.status}`)
      }

      const data = await response.json()
      onAvatarUpdate(data.url)
      toast.success(`Avatar de ${option.provider} actualizado`)
      onClose()
      resetState()
    } catch (error: unknown) {
      console.error('❌ Error updating avatar:', error)
      toast.error(`Error actualizando avatar: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsUploading(false)
    }
  }, [selectedOption, avatarOptions, onAvatarUpdate, onClose, resetState])

  // ✅ ELIMINAR AVATAR - Refactorizado con removeMedia
  const removeAvatar = useCallback(async () => {
    setIsUploading(true)
    try {
      await removeMedia('avatar', {
        showConfirm: false,
        onSuccess: () => {
          onAvatarUpdate(null)
          toast.success('Avatar removido')
          onClose()
          resetState()
        },
        onError: (error) => {
          toast.error(`Error removiendo avatar: ${error.message}`)
        }
      })
    } catch (error: unknown) {
      // El error ya fue manejado en onError
      console.error('❌ Error removing avatar:', error)
    } finally {
      setIsUploading(false)
    }
  }, [onAvatarUpdate, onClose, resetState])

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

  const refreshOptions = useCallback(async () => {
    invalidateCache()
    await loadAvatarOptions()
  }, [invalidateCache, loadAvatarOptions])

  return {
    // Estados
    isUploading,
    isLoadingOptions,
    previewUrl,
    selectedFile,
    selectedOption,
    avatarOptions,
    // Setters
    setSelectedFile,
    setSelectedOption,
    setPreviewUrl,
    // Métodos
    loadAvatarOptions,
    handleFileSelect,
    handleOptionSelect,
    handleUpload,
    useSelectedOption,
    removeAvatar,
    resetState,
    getCurrentPreview,
    getDefaultAvatar,
    invalidateCache,
    refreshOptions
  }
} */