// features/account/components/account-banner-header.tsx
'use client'

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, Image, Settings, Calendar, MapPin, Shield } from "lucide-react"
import Link from "next/link"
import { ProfileEditor } from "@/features/auth/components/profile/profile-editor"
import { MediaSelector } from "@/features/shared/components/media-selector"
import { AccountHeaderProps, UserType } from "../types"

// Presets de banners sutiles para el fondo
const SUBTLE_BANNERS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=200&fit=crop&auto=format&q=80&sat=-20&brightness=30",
    name: "Montañas suaves"
  },
  {
    id: 2, 
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=200&fit=crop&auto=format&q=80&sat=-30&brightness=25",
    name: "Bosque difuminado"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=200&fit=crop&auto=format&q=80&sat=-25&brightness=35",
    name: "Lago sereno"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=200&fit=crop&auto=format&q=80&sat=-20&brightness=30",
    name: "Océano suave"
  }
]

function getDisplayName(user: UserType): string {
  if (user.username?.trim()) {
    return user.username
  }
  const firstName = user.first_name?.trim()
  const lastName = user.last_name?.trim()
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ')
  }
  return user.email
}

function getDefaultBannerForUser(userId: number | string): string {
  const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId
  const index = isNaN(userIdAsNumber) ? 0 : userIdAsNumber % SUBTLE_BANNERS.length
  return SUBTLE_BANNERS[index].url
}

// Función para formatear fecha de registro
function formatJoinDate(date: Date | string): string {
  const joinDate = new Date(date)
  return new Intl.DateTimeFormat('es', {
    month: 'long',
    year: 'numeric'
  }).format(joinDate)
}

interface AccountBannerHeaderProps extends AccountHeaderProps {
  onBannerUpdate?: (url: string | null) => void
}

export default function AccountBannerHeader({ 
  user, 
  translations: t, 
  onAvatarUpdate, 
  onProfileUpdate,
  onBannerUpdate 
}: AccountBannerHeaderProps) {
  // Estados para el banner de fondo sutil
  const [backgroundBanner, setBackgroundBanner] = useState(() => {
    return user.banner || getDefaultBannerForUser(user.id)
  })
  
  // Estados para el avatar
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar)
  const [isUpdating, setIsUpdating] = useState(false)

  // Sincronizar con props cuando cambien externamente
  useEffect(() => {
    setCurrentAvatar(user.avatar)
  }, [user.avatar])

  useEffect(() => {
    if (user.banner !== backgroundBanner && user.banner !== null) {
      setBackgroundBanner(user.banner || getDefaultBannerForUser(user.id))
    }
  }, [user.banner, user.id])

  // Handler para actualización del banner de fondo
  const handleBackgroundUpdate = useCallback((url: string | null) => {
    if (url) {
      setBackgroundBanner(url)
      onBannerUpdate?.(url)
    }
  }, [onBannerUpdate])

  // Handler optimizado para actualización de avatar
  const handleAvatarUpdate = useCallback(async (url: string | null) => {
    setIsUpdating(true)
    
    try {
      setCurrentAvatar(url)
      
      if (onAvatarUpdate) {
        await onAvatarUpdate(url)
      }
      
      // Revalidación del caché
    /*   try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tags: ['user-info', 'header-data'],
            paths: ['/']
          })
        })
        
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        
      } catch (revalidateError) {
        console.warn('Error revalidating cache:', revalidateError)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } */
      
    } catch (error) {
      console.error('Error updating avatar:', error)
      setCurrentAvatar(user.avatar)
    } finally {
      setIsUpdating(false)
    }
  }, [user.avatar, onAvatarUpdate])

  // Función para forzar recarga manual si es necesario
 /*  const handleForceRefresh = useCallback(() => {
    window.location.reload()
  }, []) */

  return (
    <section className="flex items-center gap-4">
      <Card className="w-full overflow-hidden relative">
        {/* Fondo sutil con imagen - MÁS VISIBLE */}
        <div 
          className="absolute inset-0 opacity-40 dark:opacity-35"
          style={{
            backgroundImage: `url(${backgroundBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay más ligero para que se vea la imagen */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/75 to-background/85 dark:from-background/80 dark:via-background/70 dark:to-background/80" />
        
        {/* Control sutil del fondo */}
        <div className="absolute top-2 right-2 z-10">
          <MediaSelector
            type="banner"
            currentUrl={backgroundBanner}
            presets={SUBTLE_BANNERS}
            onUpdate={handleBackgroundUpdate}
            triggerButton={
              <Button 
                size="sm" 
                variant="ghost"
                className="h-7 px-2 text-xs opacity-60 hover:opacity-100 transition-opacity hover:bg-background/60"
              >
                <Image className="w-3 h-3" />
              </Button>
            }
            title="Cambiar Fondo"
            description="Personaliza el fondo sutil de tu header de cuenta"
          />
        </div>

        {/* Contenido aprovechando todo el ancho */}
        <CardContent className="flex items-center justify-between w-full relative z-10 py-4">
          {/* Sección izquierda: Avatar + Info principal */}
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Avatar */}
              <img
                src={currentAvatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`}
                alt="User avatar"
                className={`size-16 rounded-full object-cover bg-chart-4 ring-2 ring-primary/30 shadow-lg transition-all duration-300 ${
                  isUpdating ? 'opacity-75 scale-95' : 'opacity-100 scale-100'
                }`}
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`
                }}
              />
              
              {/* Indicador de carga */}
              {isUpdating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                </div>
              )}
              
              {/* Selector de medios optimizado */}
              <MediaSelector
                type="avatar"
                currentUrl={currentAvatar}
                onUpdate={handleAvatarUpdate}
                triggerButton={
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90 w-6 h-6 p-0 shadow-md"
                    disabled={isUpdating}
                  >
                    <Camera className="h-2.5 w-2.5" />
                  </Button>
                }
                title="Cambiar Avatar"
                description="Selecciona una nueva imagen para tu avatar"
                allowRemove={true}
                loadApiAvatars={true}
                userEmail={user.email}
              />
            </div>

            {/* Información principal compacta */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold truncate text-foreground">
                  {getDisplayName(user)}
                </h2>
                
              {/*   {isUpdating && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleForceRefresh}
                    className="text-xs h-7"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Actualizar
                  </Button>
                )} */}
              </div>

              {/* Información horizontal en una sola línea */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Badge principal más pequeño */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 rounded-full border border-primary/30 backdrop-blur-sm">
                  <Settings className="w-3 h-3 text-primary" />
                  <p className="capitalize text-xs font-medium text-primary">
                    {user.Account[0].type.toLowerCase()} {t.title}
                  </p>
                </div>
                
                {/* Username badge más pequeño */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/70 rounded-full border border-muted-foreground/30 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full" />
                  <p className="text-xs font-medium text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección derecha: Stats y acciones */}
          <div className="flex items-center gap-4">
            {/* Stats del usuario */}
            <div className="hidden md:flex items-center gap-4">
              {/* Fecha de registro */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-full border border-muted-foreground/20 backdrop-blur-sm">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Desde {formatJoinDate(user.created_at)}
                </span>
              </div>

              {/* Estado de verificación */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20 backdrop-blur-sm">
                <Shield className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Verificado
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              <ProfileEditor
                currentUsername={user.username}
                currentFirstName={user.first_name}
                currentLastName={user.last_name}
                currentPhone={user.phone}
                onProfileUpdate={onProfileUpdate}
              />
              
              {user.Account[0].type === "FREE" && (
                <Button asChild size="sm" className="bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 text-xs h-8 px-4">
                  <Link href="/upgrade">
                    {t["description.upgrade-plan"]}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}