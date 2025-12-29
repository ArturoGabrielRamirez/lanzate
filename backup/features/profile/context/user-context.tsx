'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'


import { getUserInfo } from '@/features/global/actions'
import { CurrentUser, UserContextType, UserProviderProps } from '@/features/profile/types'
import { revalidateCache } from '@/features/profile/utils/cache'

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(initialUser || null)
  const [isLoading, setIsLoading] = useState(!initialUser)
  const [error, setError] = useState<string | null>(null)

  // Función para refrescar datos del usuario desde el servidor
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { payload, hasError: userError } = await getUserInfo()

      if (userError || !payload) {
        const errorMessage = typeof userError === 'string'
          ? userError
          : 'Error al obtener información del usuario'
        throw new Error(errorMessage)
      }

      setUser(payload as CurrentUser)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error refreshing user:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para actualizar un campo específico del usuario localmente
  const updateUserField = useCallback((field: keyof CurrentUser, value: string | null) => {
    setUser((prev) => {
      if (!prev) return null
      return { ...prev, [field]: value }
    })
  }, [])

  // Función optimizada para actualizar avatar con invalidación de caché
  const updateAvatar = useCallback(async (url: string | null) => {
    // Actualización optimista del estado local
    updateUserField('avatar', url)

    // Invalidar caché del servidor de forma asíncrona
    await revalidateCache({
      tags: ['user-info', 'header-data'],
      paths: ['/']
    })
  }, [updateUserField])

  // Función optimizada para actualizar banner
  const updateBanner = useCallback(async (url: string | null) => {
    updateUserField('banner', url)

    // Revalidar también el banner si es necesario
    await revalidateCache({
      tags: ['user-info'],
      paths: ['/']
    })
  }, [updateUserField])

  // Función para actualizar múltiples campos del perfil
  const updateProfile = useCallback(async (data: Partial<CurrentUser>) => {
    setUser(prev => {
      if (!prev) return null
      return { ...prev, ...data }
    })

    // Revalidar después de actualizar el perfil
    await revalidateCache({
      tags: ['user-info'],
      paths: ['/']
    })
  }, [])

  // Cargar usuario inicial si no se proporcionó
  useEffect(() => {
    if (!initialUser && !user && !isLoading) {
      refreshUser()
    }
  }, [initialUser, user, isLoading, refreshUser])

  const value: UserContextType = {
    user,
    isLoading,
    error,
    refreshUser,
    updateUserField,
    updateAvatar,
    updateBanner,
    updateProfile
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider')
  }

  return context
}

// Hook para obtener solo los datos del usuario (sin las funciones)
export function useUserData() {
  const { user, isLoading, error } = useUser()
  return { user, isLoading, error }
}

// Hook para obtener solo las funciones de actualización
export function useUserActions() {
  const {
    refreshUser,
    updateUserField,
    updateAvatar,
    updateBanner,
    updateProfile
  } = useUser()

  return {
    refreshUser,
    updateUserField,
    updateAvatar,
    updateBanner,
    updateProfile
  }
}