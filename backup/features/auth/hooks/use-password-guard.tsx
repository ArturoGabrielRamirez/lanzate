'use client'
import { useState, useEffect } from 'react'

import { createClient } from '@/utils/supabase/client'

export default function usePasswordGuard() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkPasswordStatus()
  }, [])

  const checkPasswordStatus = async () => {
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        setHasPassword(false)
        return
      }

      // Debug: Vamos a ver toda la info del usuario
      console.log('User data:', {
        identities: user.identities,
        app_metadata: user.app_metadata,
        user_metadata: user.user_metadata
      })

      // Método más directo: intentar obtener info de la sesión
      const identities = user.identities || []
      const hasEmailIdentity = identities.some((identity: { provider: string }) => identity.provider === 'email')
      
      // También verificar si tiene password en user metadata
      const hasPasswordSet = user.user_metadata?.password_set === true
      
      // Debug
      console.log('Password check:', { hasEmailIdentity, hasPasswordSet })
      
      const result = hasEmailIdentity || hasPasswordSet
      console.log('Final hasPassword result:', result)
      
      setHasPassword(result)
    } catch (error) {
      console.error('Error checking password status:', error)
      setHasPassword(false)
    } finally {
      setLoading(false)
    }
  }

  const refreshPasswordStatus = () => {
    setLoading(true)
    checkPasswordStatus()
  }

  return {
    hasPassword,
    loading,
    refreshPasswordStatus
  }
}