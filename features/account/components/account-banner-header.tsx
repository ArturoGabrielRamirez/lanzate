'use client'

import { Camera, RefreshCw, Image as Img, Settings } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useCallback, useEffect } from "react"

import { AccountBannerHeaderProps } from "@/features/account/types"
import { getDisplayName, SUBTLE_BANNERS } from "@/features/account/utils"
import { PageHeader } from "@/features/dashboard/components"
import { MediaSelector } from "@/features/global/components/media-selector"
import { getDefaultBannerForUser } from "@/features/profile/utils/get-default-banner-for-user"
import { Button } from "@/features/shadcn/components/ui/button"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"

export function AccountBannerHeader({
  user,
  onAvatarUpdate,
  onBannerUpdate,
}: AccountBannerHeaderProps) {
  const [backgroundBanner, setBackgroundBanner] = useState(() => {
    return user.banner || getDefaultBannerForUser(user.id)
  })
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setCurrentAvatar(user.avatar)
  }, [user.avatar])

  useEffect(() => {
    if (user.banner !== backgroundBanner && user.banner !== null) {
      setBackgroundBanner(user.banner || getDefaultBannerForUser(user.id))
    }
  }, [user.banner, user.id, backgroundBanner])

  const handleBackgroundUpdate = useCallback((url: string | null) => {
    if (url) {
      setBackgroundBanner(url)
      onBannerUpdate?.(url)
    }
  }, [onBannerUpdate])

  const handleAvatarUpdate = useCallback(async (url: string | null) => {
    setIsUpdating(true)
    try {
      setCurrentAvatar(url)
      if (onAvatarUpdate) {
        onAvatarUpdate(url)
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
      setCurrentAvatar(user.avatar)
    } finally {
      setIsUpdating(false)
    }
  }, [user.avatar, onAvatarUpdate])

  const profileUrl = `https://lanzate.app/u/${user.username}`
  const breadcrumbs = [
    { label: 'Cuenta', href: '/account' },
  ]

  // Avatar con Selector
  const AvatarWithSelector = (
    <div className="relative flex-shrink-0">
      <Image
        src={currentAvatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`}
        alt="User avatar"
        className={`rounded-full object-cover bg-chart-4 ring-2 ring-primary/30 shadow-lg transition-all duration-300 ${
          isUpdating ? 'opacity-75 scale-95' : 'opacity-100 scale-100'
        }`}
        onError={(e) => {
          e.currentTarget.src = `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`
        }}
        width={64}
        height={64}
      />
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
          <RefreshCw className="w-4 h-4 text-white animate-spin" />
        </div>
      )}
      <MediaSelector
        type="avatar"
        currentUrl={currentAvatar}
        onUpdate={handleAvatarUpdate}
        triggerButton={
          <Button
            data-action="change-avatar"
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
  )

  // ✅ CORRECCIÓN: Usar span en lugar de p para evitar el error de <p> dentro de <p>
  const SubtitleContent = (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 rounded-full border border-primary/30 backdrop-blur-sm">
        <Settings className="w-3 h-3 text-primary" />
        <span className="capitalize text-xs font-medium text-primary">
          Cuenta
        </span>
      </div>
      <Link
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/70 rounded-full border border-muted-foreground/30 backdrop-blur-sm transition-opacity hover:opacity-80"
      >
        <div className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full" />
        <span className="text-xs font-medium text-muted-foreground">
          @{user.username}
        </span>
      </Link>
    </div>
  )

  return (
    <section className="flex items-center gap-4">
      <Card className="w-full overflow-hidden relative">
        {/* Fondo del Banner */}
        <div
          className="absolute inset-0 opacity-40 dark:opacity-35"
          style={{
            backgroundImage: `url(${backgroundBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background/85 via-background/75 to-background/85 dark:from-background/80 dark:via-background/70 dark:to-background/80" />
        
        {/* Selector de Banner */}
        <div className="absolute top-2 right-2 z-20 pr-2">
          <MediaSelector
            type="banner"
            currentUrl={backgroundBanner}
            presets={SUBTLE_BANNERS}
            onUpdate={handleBackgroundUpdate}
            triggerButton={
              <Button
                size="sm"
                variant="ghost"
                className="p-2 size-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity hover:bg-background/60"
              >
                <Img className="w-5 h-5" />
              </Button>
            }
            title="Cambiar Fondo"
            description="Personaliza el fondo sutil de tu header de cuenta"
          />
        </div>

        {/* Contenido Principal */}
        <CardContent className="flex w-full relative z-10 py-3">
          <div className="w-full">
            <PageHeader
              title={getDisplayName(user)}
              subtitle={SubtitleContent}
              breadcrumbs={breadcrumbs}
              media={AvatarWithSelector}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}