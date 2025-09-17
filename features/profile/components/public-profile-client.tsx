'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { MapPin, Settings, UserPlus, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'


import { getCurrentUser } from '@/features/auth/actions'
import { ProfileBanner } from './profile-banner'
import { UserLikedProducts } from './user-liked-products'
import { UserActivities } from './user-activity'
import { checkIfFollowing, toggleFollowUser } from '../actions'
import { PublicUserProfile } from '../types'

interface PublicProfileClientProps {
  user: PublicUserProfile
}

interface UserState {
  id: number | string
  username?: string
  supabase_user_id?: string
}

export function PublicProfileClient({ user }: PublicProfileClientProps) {
  // Estados principales
  const [currentUser, setCurrentUser] = useState<UserState | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(true)
  
  // Estados de contadores con inicialización desde props
  const [followersCount, setFollowersCount] = useState(user._count.user_follows)
  const [followingCount, setFollowingCount] = useState(user._count.user_follows_following)

  // Estados de actualización de perfil
  const [profileData, setProfileData] = useState({
    avatar: user.avatar,
    banner: user.banner
  })

  // Valor computado del nombre a mostrar
  const displayName = useMemo(() => {
    return user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.username
  }, [user.first_name, user.last_name, user.username])

  // Determinar si es el perfil propio - mejorado
  const isOwnProfile = useMemo(() => {
    if (!currentUser) return false
    
    // Múltiples formas de comparar
    const matchByUsername = currentUser.username === user.username
    const matchByNumericId = typeof currentUser.id === 'number' && 
                            typeof user.id === 'number' && 
                            currentUser.id === user.id
    const matchBySupabaseId = currentUser.supabase_user_id === user.supabase_user_id
    const matchByMixedId = (typeof currentUser.id === 'string' && 
                           currentUser.id === user.supabase_user_id)
    
    return matchByUsername || matchByNumericId || matchBySupabaseId || matchByMixedId
  }, [currentUser, user])

  // Determinar si mostrar botón de seguir
  const showFollowButton = useMemo(() => {
    return currentUser && !isOwnProfile && !isUserLoading
  }, [currentUser, isOwnProfile, isUserLoading])

  // Función para cargar usuario actual y estado de seguimiento
  const loadUserAndFollowStatus = useCallback(async () => {
    try {
      setIsUserLoading(true)
      const userResponse = await getCurrentUser()

      if (userResponse?.payload && !userResponse.error) {
        const userData = userResponse.payload
        setCurrentUser(userData)

        // Si no es el mismo usuario, verificar estado de seguimiento
        const isSameUser = userData.username === user.username ||
                          (userData.id && user.id && userData.id === user.id) ||
                          (userData.supabase_user_id && user.supabase_user_id && 
                           userData.supabase_user_id === user.supabase_user_id)

        if (!isSameUser && userData.id) {
          const followResponse = await checkIfFollowing(userData.id, user.id)
          if (followResponse && !followResponse.error) {
            setIsFollowing(followResponse.payload)
          }
        }
      }
    } catch (error) {
      console.error('Error loading user and follow status:', error)
    } finally {
      setIsUserLoading(false)
    }
  }, [user.id, user.username, user.supabase_user_id])

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadUserAndFollowStatus()
  }, [loadUserAndFollowStatus])

  // Handler optimizado para seguir/dejar de seguir
  const handleFollowToggle = useCallback(async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para seguir usuarios.')
      return
    }

    setIsFollowLoading(true)
    try {
      const response = await toggleFollowUser(user.id)

      if (response && !response.error) {
        const newIsFollowing = response.payload.isFollowing
        setIsFollowing(newIsFollowing)

        // Actualizar contador optimísticamente
        setFollowersCount((prev: number) => newIsFollowing ? prev + 1 : Math.max(0, prev - 1))

        const message = newIsFollowing
          ? `Ahora sigues a ${displayName}`
          : `Dejaste de seguir a ${displayName}`
        console.log(message)
      } else {
        const errorMessage = response?.message || 'Error al actualizar seguimiento'
        alert(errorMessage)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      alert('Error inesperado. Intenta de nuevo.')
    } finally {
      setIsFollowLoading(false)
    }
  }, [currentUser, user.id, displayName])

  // Handlers para actualización de perfil - optimizados para invalidar caché
  const handleBannerUpdate = useCallback(async (url: string | null) => {
    if (url) {
      setProfileData(prev => ({ ...prev, banner: url }))
      console.log("Banner actualizado:", url)
    }
  }, [])

  const handleAvatarUpdate = useCallback(async (url: string | null) => {
    if (url) {
      setProfileData(prev => ({ ...prev, avatar: url }))
      console.log("Avatar actualizado:", url)
      
      // Forzar revalidación del header
     /*  try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tags: ['user-info', 'header'],
            paths: ['/']
          })
        })
        // Recargar solo el header o la página
        window.location.reload() // Temporal hasta implementar state management
      } catch (error) {
        console.warn('Error invalidating cache:', error)
      } */
    }
  }, [])

  // Componente de botón de acción principal
  const ActionButton = useMemo(() => {
    if (isUserLoading) {
      return (
        <div className="w-full md:w-auto h-10 bg-muted animate-pulse rounded-md"></div>
      )
    }

    if (isOwnProfile) {
      return (
        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => console.log('Abrir configuraciones del perfil')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Configurar Perfil
        </Button>
      )
    }

    if (showFollowButton) {
      return (
        <Button
          onClick={handleFollowToggle}
          disabled={isFollowLoading}
          variant={isFollowing ? "outline" : "default"}
          className="w-full md:w-auto"
        >
          {isFollowLoading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {isFollowing ? "Dejando de seguir..." : "Siguiendo..."}
            </>
          ) : isFollowing ? (
            <>
              <UserMinus className="w-4 h-4 mr-2" />
              No seguir
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Seguir
            </>
          )}
        </Button>
      )
    }

    if (currentUser === null) {
      return (
        <Button
          onClick={() => alert("Inicia sesión para seguir usuarios")}
          variant="default"
          className="w-full md:w-auto"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Seguir
        </Button>
      )
    }

    return null
  }, [isUserLoading, isOwnProfile, showFollowButton, currentUser, isFollowing, isFollowLoading, handleFollowToggle])

  return (
    <div className="max-w-4xl mx-auto">
      {/* ProfileBanner con botón de acción y fecha integrados */}
      <ProfileBanner
        user={{
          ...user,
          banner: profileData.banner,
          avatar: profileData.avatar
        }}
        currentUserId={currentUser?.id}
        currentUsername={currentUser?.username}
        onBannerUpdate={handleBannerUpdate}
        onAvatarUpdate={handleAvatarUpdate}
        isOwnProfile={isOwnProfile}
        actionButton={ActionButton}
      />

      <div className="px-6 md:px-8 pt-6">
        {/* Layout principal en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar izquierdo con información del perfil */}
          <div className="lg:col-span-1 space-y-6">
            {/* Biografía */}
            {user.profile_bio && (
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Sobre mí</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {user.profile_bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Ubicación */}
            {user.show_location && user.location && (
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-medium">{user.location}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats mejorados */}
            <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Seguidores</span>
                    <span className="text-xl font-bold text-white">{followersCount}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((followersCount / Math.max(followersCount, followingCount, 1)) * 100, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Siguiendo</span>
                    <span className="text-xl font-bold text-white">{followingCount}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((followingCount / Math.max(followersCount, followingCount, 1)) * 100, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Me gusta</span>
                    <span className="text-xl font-bold text-white">{user._count.product_likes}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((user._count.product_likes / Math.max(user._count.product_likes, followersCount, followingCount, 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-0">
                {/* Tabs section mejorados */}
                <Tabs defaultValue="activity" className="w-full">
                  <div className="border-b border-gray-700/50 px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700/50">
                      <TabsTrigger 
                        value="activity"
                        className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-400/30 text-gray-300 hover:text-white transition-all duration-200"
                      >
                        Actividad
                      </TabsTrigger>
                      <TabsTrigger 
                        value="likes" 
                        disabled={!user.show_liked_products}
                        className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-400/30 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50"
                      >
                        Me gusta
                      </TabsTrigger>
                      <TabsTrigger 
                        value="comments" 
                        disabled={!user.show_comments}
                        className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400 data-[state=active]:border-orange-400/30 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-50"
                      >
                        Comentarios
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="activity" className="p-6 mt-0">
                    <UserActivities
                      userId={user.id}
                      isOwnProfile={isOwnProfile}
                      showPrivateActivities={isOwnProfile}
                    />
                  </TabsContent>

                  <TabsContent value="likes" className="p-6 mt-0">
                    <UserLikedProducts
                      userId={user.id}
                      isOwnProfile={isOwnProfile}
                    />
                  </TabsContent>

                  <TabsContent value="comments" className="p-6 mt-0">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💬</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Comentarios próximamente</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Estamos trabajando en esta funcionalidad para que puedas ver y gestionar todos tus comentarios.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}