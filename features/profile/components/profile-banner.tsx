"use client"

import { useState, useEffect, useCallback, memo, ReactNode } from "react"
import { Image, Camera, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { MediaSelector } from "@/features/shared/components/media-selector"

interface UserProfileInfo {
  id: number | string
  banner?: string | null
  avatar?: string | null
  username: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  created_at: Date | string
}

interface ProfileBannerProps {
  user: UserProfileInfo
  currentUserId?: number | string
  currentUsername?: string
  onBannerUpdate?: (url: string | null) => void
  onAvatarUpdate?: (url: string | null) => void
  isOwnProfile: boolean
  loadingBanner?: boolean
  loadingAvatar?: boolean
  actionButton?: ReactNode
}

const PRESET_BANNERS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop&auto=format&q=80",
    name: "Montañas al amanecer"
  },
  {
    id: 2, 
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=400&fit=crop&auto=format&q=80",
    name: "Bosque brumoso"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=400&fit=crop&auto=format&q=80", 
    name: "Lago sereno"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=400&fit=crop&auto=format&q=80",
    name: "Océano al atardecer"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=400&fit=crop&auto=format&q=80",
    name: "Colinas verdes"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=400&fit=crop&auto=format&q=80",
    name: "Desierto dorado"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1464822759356-8d6106e78f86?w=1920&h=400&fit=crop&auto=format&q=80",
    name: "Montañas nevadas"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop&auto=format&q=80",
    name: "Bosque otoñal"
  }
]

// Función para obtener banner por defecto con cache local
const getDefaultBannerForUser = (() => {
  const cache = new Map<string, string>()
  
  return (userId: number | string): string => {
    const cacheKey = String(userId)
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!
    }
    
    const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId
    const index = isNaN(userIdAsNumber) ? 0 : userIdAsNumber % PRESET_BANNERS.length
    const banner = PRESET_BANNERS[index].url
    
    cache.set(cacheKey, banner)
    return banner
  }
})()

// Función para formatear fechas
const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(date))
}

// Componente memorizado para la imagen del banner
const BannerImage = memo(({ 
  bannerUrl, 
  isLoading,
  onLoad,
  onError 
}: {
  bannerUrl: string
  isLoading: boolean
  onLoad: () => void
  onError: () => void
}) => {
  if (isLoading) {
    return <Skeleton className="w-full h-full" />
  }

  return (
    <img
      src={bannerUrl}
      alt="Banner del perfil"
      className="w-full h-full object-cover transition-all duration-300"
      style={{ 
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
      }}
      onLoad={onLoad}
      onError={onError}
      loading="eager"
    />
  )
})

BannerImage.displayName = 'BannerImage'

// Componente memorizado para el avatar
const ProfileAvatar = memo(({ 
  avatarUrl, 
  bannerUrl,
  displayName, 
  isLoading,
  loadingBanner,
  isOwnProfile,
  onAvatarUpdate,
  handleBannerUpdate,
  userEmail 
}: {
  avatarUrl: string | null
  bannerUrl: string | null
  displayName: string
  isLoading: boolean
  loadingBanner: boolean
  isOwnProfile: boolean
  onAvatarUpdate?: (url: string | null) => void
  handleBannerUpdate?: (url: string | null) => void
  userEmail?: string | null
}) => {
  if (isLoading) {
    return <Skeleton className="w-32 h-32 rounded-full border-4 border-white shadow-xl" />
  }

  return (
    <div className="relative">
      <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-2 ring-white/20">
        <AvatarImage 
          src={avatarUrl || undefined} 
          alt={displayName}
          loading="eager"
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {/* Controles del avatar para usuarios propios */}
      {isOwnProfile && (
        <MediaSelector
          type="avatar"
          currentUrl={avatarUrl}
          onUpdate={onAvatarUpdate || (() => {})}
          triggerButton={
            <Button
              size="sm"
              variant="secondary"
              className="absolute bg-secondary bottom-2 right-2 w-8 h-8 rounded-full p-0 shadow-lg bg-white hover:bg-white/90 border border-white/50 hover:scale-110 transition-all duration-200"
            >
              <Camera className="w-4 h-4" />
            </Button>
          }
          title="Cambiar Avatar"
          description="Tu avatar aparecerá en tu perfil y junto a tus comentarios"
          allowRemove={true}
          loadApiAvatars={true}
          userEmail={userEmail || undefined}
        />
      )}

       {/* Controles del banner para usuarios propios */}
          {/* {isOwnProfile && !loadingBanner && (
            <div className="absolute bottom-6 right-6 z-50">
              <MediaSelector
                type="banner"
                currentUrl={bannerUrl}
                presets={PRESET_BANNERS}
                onUpdate={handleBannerUpdate || (() => {})}
                triggerButton={
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="shadow-xl backdrop-blur-md bg-white/15 text-white border border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-200 font-medium"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Cambiar Banner
                  </Button>
                }
                title="Cambiar Banner del Perfil"
                description="Personaliza tu banner con una imagen propia, elige entre las opciones predefinidas o selecciona uno de tus banners guardados"
              />
            </div>
          )} */}
    </div>
  )
})

ProfileAvatar.displayName = 'ProfileAvatar'

export function ProfileBanner({ 
  user,
  currentUserId,
  currentUsername,
  onBannerUpdate,
  onAvatarUpdate,
  isOwnProfile,
  loadingBanner = false,
  loadingAvatar = false,
  actionButton
}: ProfileBannerProps) {
  const displayName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.username
  
  // Estados optimizados con valores iniciales inteligentes
  const [bannerUrl, setBannerUrl] = useState(() => {
    if (user.banner) return user.banner
    return getDefaultBannerForUser(user.id)
  })
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar || null)
  const [bannerImageLoading, setBannerImageLoading] = useState(false)
  const [bannerImageError, setBannerImageError] = useState(false)

  // Sincronizar con props solo cuando realmente cambien
  useEffect(() => {
    if (user.banner !== bannerUrl && user.banner !== null) {
      setBannerUrl(user.banner || getDefaultBannerForUser(user.id))
    }
  }, [user.banner, user.id])

  useEffect(() => {
    if (user.avatar !== avatarUrl) {
      setAvatarUrl(user.avatar || null)
    }
  }, [user.avatar])

  // Handlers optimizados con useCallback
  const handleBannerUpdate = useCallback((url: string | null) => {
    if (url) {
      setBannerUrl(url)
      onBannerUpdate?.(url)
    }
  }, [onBannerUpdate])

  const handleAvatarUpdate = useCallback((url: string | null) => {
    setAvatarUrl(url)
    onAvatarUpdate?.(url)
  }, [onAvatarUpdate])

  const handleBannerLoad = useCallback(() => {
    setBannerImageLoading(false)
    setBannerImageError(false)
  }, [])

  const handleBannerError = useCallback(() => {
    setBannerImageLoading(false)
    setBannerImageError(true)
    // Fallback al banner por defecto si falla la carga
    const defaultBanner = getDefaultBannerForUser(user.id)
    if (bannerUrl !== defaultBanner) {
      setBannerUrl(defaultBanner)
    }
  }, [bannerUrl, user.id])

  return (
    <div className="relative w-full">
      {/* Banner Container - Adaptado para modo claro/oscuro */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-56 md:h-72 bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-amber-500/10 relative">
          {/* Banner Image o Skeleton */}
          {loadingBanner ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <>
              <BannerImage 
                bannerUrl={bannerUrl}
                isLoading={bannerImageLoading}
                onLoad={handleBannerLoad}
                onError={handleBannerError}
              />
              
              {bannerImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-amber-500/20">
                  <div className="text-center text-white/60">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Error cargando banner</p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Overlay gradient adaptado para modo claro - MÁS OSCURO */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent dark:from-gray-900/80 dark:via-gray-900/20 dark:to-transparent" />
          
          {/* Controles del banner para usuarios propios */}
          {isOwnProfile && !loadingBanner && (
            <div className="absolute bottom-6 right-6 z-50">
              <MediaSelector
                type="banner"
                currentUrl={bannerUrl}
                presets={PRESET_BANNERS}
                onUpdate={handleBannerUpdate}
                triggerButton={
                  <Button 
                     size="sm" 
                    variant="secondary"
                    className="shadow-xl backdrop-blur-md bg-white/15 text-white border border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-200 font-medium"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Cambiar Banner
                  </Button>
                }
                title="Cambiar Banner del Perfil"
                description="Personaliza tu banner con una imagen propia o elige entre las opciones predefinidas"
              />
            </div>
          )}
        </div>
        
        {/* Información del perfil centrada */}
        <div className="relative">
          {/* Contenedor principal centrado */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 py-8 -mt-16 relative z-10">
              {/* Avatar */}
              <div className="flex-shrink-0 self-center md:self-start">
                <ProfileAvatar
                  avatarUrl={avatarUrl}
                  displayName={displayName}
                  isLoading={loadingAvatar}
                  isOwnProfile={isOwnProfile}
                  onAvatarUpdate={handleAvatarUpdate}
                  userEmail={user.email} bannerUrl={null} loadingBanner={false}                />
              </div>
              
              {/* Información del usuario - MEJORADA PARA MODO CLARO */}
              <div className="flex-1 text-center md:text-left md:pb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-2xl">
                  {displayName}
                </h1>
                <p className="text-white/90 text-xl mb-4 drop-shadow-lg font-medium">
                  @{user.username}
                </p>
                
                {/* Info adicional con mejor contraste */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-white/90">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-lg">
                    <User className="w-4 h-4 text-orange-300" />
                    <span className="font-medium">Miembro de Lanzate</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-lg">
                    <Calendar className="w-4 h-4 text-orange-300" />
                    <span className="font-medium">Desde {formatDate(user.created_at)}</span>
                  </div>
                </div>
              </div>
              
              {/* Botón de acción */}
              <div className="flex-shrink-0 flex justify-center md:justify-end md:pb-4">
                {actionButton}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}