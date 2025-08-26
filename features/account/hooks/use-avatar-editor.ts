import { useState, useCallback, useRef } from 'react'
import { toast } from "sonner"
import { AvatarOption } from '@/features/account/types'

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
  
  // Cache por 10 minutos (más tiempo para opciones dinámicas)
  const CACHE_DURATION = 10 * 60 * 1000
  const abortControllerRef = useRef<AbortController | null>(null)

  const getDefaultAvatar = useCallback(() => {
    return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userEmail)}&backgroundColor=transparent`
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
      // Usar el endpoint mejorado
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

      // En caso de error, al menos cargar avatares generados básicos
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
  }, [currentAvatar, optionsCache, CACHE_DURATION, getDefaultAvatar, userEmail])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error(`La imagen debe ser menor a ${maxSize / 1024 / 1024}MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no soportado. Usa JPG, PNG, GIF o WebP')
      return
    }

    setSelectedFile(file)
    setSelectedOption(null)


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
/*     const option = avatarOptions.find(opt => opt.id === optionId) */
    
    setSelectedOption(optionId)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [avatarOptions, fileInputRef])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      toast.error('No hay archivo seleccionado')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', 'avatar')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Error HTTP ${uploadResponse.status}`)
      }

      const uploadData = await uploadResponse.json()
  

      // Actualizar avatar en la base de datos

      const updateResponse = await fetch('/api/user/avatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarUrl: uploadData.url
        }),
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error actualizando avatar')
      }

   /*    const updateData = await updateResponse.json() */


      // Invalidar cache para forzar recarga
      setOptionsCache(null)
      
      onAvatarUpdate(uploadData.url)
      toast.success('Avatar personalizado subido correctamente')
      onClose()
      resetState()

    } catch (error: any) {
      console.error('❌ Error uploading avatar:', error)
      toast.error(`Error subiendo avatar: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, onAvatarUpdate, onClose])

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
        throw new Error(errorData.error || `Error HTTP ${response.status}`)
      }

     /*  const data = await response.json() */

      onAvatarUpdate(option.url)
      toast.success(`Avatar de ${option.provider} actualizado`)
      onClose()
      resetState()

    } catch (error: any) {
      console.error('❌ Error updating avatar:', error)
      toast.error(`Error actualizando avatar: ${error.message}`)
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
        throw new Error(errorData.error || `Error HTTP ${response.status}`)
      }

      onAvatarUpdate(null)
      toast.success('Avatar removido')
      onClose()
      resetState()

    } catch (error: any) {
      console.error('❌ Error removing avatar:', error)
      toast.error(`Error removiendo avatar: ${error.message}`)
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

  const refreshOptions = useCallback(async () => {
    invalidateCache()
    await loadAvatarOptions()
  }, [invalidateCache, loadAvatarOptions])

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
    invalidateCache,
    refreshOptions
  }
}