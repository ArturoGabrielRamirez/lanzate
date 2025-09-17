// features/account/components/account-header.tsx
'use client'

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw } from "lucide-react"
import Link from "next/link"
import { ProfileEditor } from "@/features/auth/components/profile/profile-editor"
import { MediaSelector } from "@/features/shared/components/media-selector"
import { AccountHeaderProps, UserType } from "../types"

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

export default function AccountHeader({ 
  user, 
  translations: t, 
  onAvatarUpdate, 
  onProfileUpdate 
}: AccountHeaderProps) {
  // Estado local para el avatar que se actualiza inmediatamente
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar)
  const [isUpdating, setIsUpdating] = useState(false)

  // Sincronizar con props cuando cambie externamente
  useEffect(() => {
    setCurrentAvatar(user.avatar)
  }, [user.avatar])

  // Handler optimizado para actualización de avatar
  const handleAvatarUpdate = useCallback(async (url: string | null) => {
    setIsUpdating(true)
    
    try {
      // Actualizar inmediatamente en la UI local
      setCurrentAvatar(url)
      
      // Llamar al callback del padre
      if (onAvatarUpdate) {
        await onAvatarUpdate(url)
      }
      
      // Forzar revalidación del caché del servidor
    /*   try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tags: ['user-info', 'header-data'],
            paths: ['/']
          })
        })
        
        // Recargar la página para asegurar que todos los componentes se actualicen
        // Este es un enfoque temporal hasta implementar un state manager global
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        
      } catch (revalidateError) {
        console.warn('Error revalidating cache:', revalidateError)
        // Si falla la revalidación, al menos recargar la página
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } */
      
    } catch (error) {
      console.error('Error updating avatar:', error)
      // Revertir el cambio local si algo sale mal
      setCurrentAvatar(user.avatar)
    } finally {
      setIsUpdating(false)
    }
  }, [user.avatar, onAvatarUpdate])

  // Función para forzar recarga manual si es necesario
/*   const handleForceRefresh = useCallback(() => {
    window.location.reload()
  }, []) */

  return (
    <section className="flex items-center gap-4">
      <Card className="w-full">
        <CardContent className="flex items-center gap-4 w-full">
          <div className="relative">
            {/* Avatar con estado local actualizado inmediatamente */}
            <img
              src={currentAvatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`}
              alt="User avatar"
              className={`size-24 rounded-full object-cover bg-chart-4 ring-1 ring-primary transition-all duration-300 ${
                isUpdating ? 'opacity-75 scale-95' : 'opacity-100 scale-100'
              }`}
              onError={(e) => {
                // Fallback si la imagen falla al cargar
                e.currentTarget.src = `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`
              }}
            />
            
            {/* Indicador de carga */}
            {isUpdating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                <RefreshCw className="w-6 h-6 text-white animate-spin" />
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
                  className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
                  disabled={isUpdating}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              }
              title="Cambiar Avatar"
              description="Selecciona una nueva imagen para tu avatar"
              allowRemove={true}
              loadApiAvatars={true}
              userEmail={user.email}
            />
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold truncate">
                {getDisplayName(user)}
              </h2>
              
              <div className="flex items-center gap-2">
                <ProfileEditor
                  currentUsername={user.username}
                  currentFirstName={user.first_name}
                  currentLastName={user.last_name}
                  currentPhone={user.phone}
                  onProfileUpdate={onProfileUpdate}
                />
                
                {/* Botón de recarga manual si es necesario */}
                {/* {isUpdating && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleForceRefresh}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Actualizar
                  </Button>
                )} */}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 pl-2">
              <p className="capitalize text-sm">
                {user.Account[0].type.toLowerCase()} {t.title}
              </p>
              
              {user.Account[0].type === "FREE" && (
                <Button asChild size="sm" className="bg-gradient-to-b from-primary/95 to-chart-5/65 text-white hover:from-primary/100 hover:to-chart-5/90">
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