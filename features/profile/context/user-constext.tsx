// contexts/user-context.tsx
'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { getUserInfo } from '@/features/layout/actions'

interface UserInfo {
  id: number
  username: string
  first_name?: string | null
  last_name?: string | null
  email: string
  avatar?: string | null
  banner?: string | null
  phone?: string | null
  supabase_user_id?: string
  Account: Array<{ type: string }>
  created_at: Date | string
}

interface UserContextType {
  user: UserInfo | null
  isLoading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  updateUserField: (field: keyof UserInfo, value: any) => void
  updateAvatar: (url: string | null) => void
  updateBanner: (url: string | null) => void
  updateProfile: (data: Partial<UserInfo>) => void
}

const UserContext = createContext<UserContextType | null>(null)

interface UserProviderProps {
  children: ReactNode
  initialUser?: any // Cambiado para aceptar cualquier tipo de usuario
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser || null)
  const [isLoading, setIsLoading] = useState(!initialUser)
  const [error, setError] = useState<string | null>(null)

  // Función para refrescar datos del usuario desde el servidor
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { payload, error: userError } = await getUserInfo()
      
      if (userError || !payload) {
        // Manejo correcto del tipo de error
        const errorMessage = typeof userError === 'string' ? userError : 'Error al obtener información del usuario'
        throw new Error(errorMessage)
      }
      
      setUser(payload as UserInfo)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error refreshing user:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para actualizar un campo específico del usuario localmente
  const updateUserField = useCallback((field: keyof UserInfo, value: any) => {
    setUser(prev => {
      if (!prev) return null
      return { ...prev, [field]: value }
    })
  }, [])

  // Función optimizada para actualizar avatar con invalidación de caché
  const updateAvatar = useCallback(async (url: string | null) => {
    updateUserField('avatar', url)
    
    // Invalidar caché del header después de actualizar avatar
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tags: ['user-info', 'header-data'],
          paths: ['/'] 
        })
      })
    } catch (error) {
      console.warn('Error invalidating cache:', error)
    }
  }, [updateUserField])

  // Función optimizada para actualizar banner
  const updateBanner = useCallback((url: string | null) => {
    updateUserField('banner', url)
  }, [updateUserField])

  // Función para actualizar múltiples campos del perfil
  const updateProfile = useCallback((data: Partial<UserInfo>) => {
    setUser(prev => {
      if (!prev) return null
      return { ...prev, ...data }
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