'use client'

import { Button } from '@/features/shadcn/components/ui/button'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { ProfileSettingsForm } from './profile-settings-form'
import { ProfileActionButtonProps } from '../types'

export function ProfileActionButton({
  isUserLoading,
  isOwnProfile,
  showFollowButton,
  isFollowing,
  isFollowLoading,
  onFollowToggle,
  user,
  currentUser
}: ProfileActionButtonProps) {
  // 🌀 Mostrar skeleton si el usuario está cargando
  if (isUserLoading) {
    return (
      <div className="w-full md:w-auto h-10 bg-muted animate-pulse rounded-md" />
    )
  }

  // ⚙️ Si es tu propio perfil, mostrar directamente el popup configurador
  if (isOwnProfile) {
    return <ProfileSettingsForm user={user} />
  }

  // 👥 Botón de seguir / dejar de seguir
  if (showFollowButton) {
    return (
      <Button
        onClick={onFollowToggle}
        disabled={isFollowLoading}
        variant={isFollowing ? 'outline' : 'default'}
        className="w-full md:w-auto"
      >
        {isFollowLoading ? (
          <>
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Cargando... {/* ✅ CAMBIO: Ya no muestra "Siguiendo..." o "Dejando de seguir..." */}
          </>
        ) : isFollowing ? (
          <>
            <UserMinus className="w-4 h-4 mr-2" />
          Dejar de seguir
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

  // 🔒 Si no hay usuario logueado
  if (!currentUser) {
    return (
      <Button
        onClick={() => alert('Inicia sesión para seguir usuarios')}
        variant="default"
        className="w-full md:w-auto"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Seguir
      </Button>
    )
  }

  return null
}