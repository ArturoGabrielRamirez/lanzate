import { useState, useCallback } from 'react'
import { toast } from "sonner"
import { AvatarOption } from '../types'

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

  const getDefaultAvatar = useCallback(() => {
    return `https://api.dicebear.com/9.x/initials/svg?seed=${userEmail}`
  }, [userEmail])

  const loadAvatarOptions = useCallback(async () => {
    setIsLoadingOptions(true)
    try {
      const response = await fetch('/api/user/avatar/options')
      if (response.ok) {
        const data = await response.json()
        setAvatarOptions(data.options || [])

        if (currentAvatar) {
          const matchingOption = data.options?.find((option: AvatarOption) =>
            option.url === currentAvatar
          )
          if (matchingOption) {
            setSelectedOption(matchingOption.id)
          }
        }
      }
    } catch (error) {
      console.error('Error loading avatar options:', error)
    } finally {
      setIsLoadingOptions(false)
    }
  }, [currentAvatar])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB')
      return
    }

    setSelectedFile(file)
    setSelectedOption(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
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
        throw new Error('Error al subir la imagen')
      }

      const data = await response.json()

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

      onAvatarUpdate(data.url)
      toast.success('Avatar actualizado correctamente')
      onClose()
      resetState()

    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Error al actualizar el avatar')
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
        throw new Error('Error al actualizar el avatar')
      }

      onAvatarUpdate(option.url)
      toast.success(`Avatar de ${option.provider} actualizado`)
      onClose()
      resetState()

    } catch (error) {
      console.error('Error updating avatar:', error)
      toast.error('Error al actualizar el avatar')
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
        throw new Error('Error al remover el avatar')
      }

      onAvatarUpdate(null)
      toast.success('Avatar removido')
      onClose()
      resetState()

    } catch (error) {
      console.error('Error removing avatar:', error)
      toast.error('Error al remover el avatar')
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
    getDefaultAvatar
  }
}