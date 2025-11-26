'use client'

import { Camera, RefreshCw, Image as Img, Settings, Calendar, Shield } from "lucide-react"
import Image from 'next/image';
import { useState, useCallback, useEffect } from "react"

import { AccountBannerHeaderProps } from "@/features/account/types"
import { formatJoinDate, getDisplayName, SUBTLE_BANNERS } from "@/features/account/utils"
import { ProfileEditor } from "@/features/auth/components/profile/profile-editor"
import { MediaSelector } from "@/features/global/components/media-selector";
import { getDefaultBannerForUser } from "@/features/profile/utils/get-default-banner-for-user"
import { Button } from "@/features/shadcn/components/ui/button"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"


export function AccountBannerHeader({
  user,
  /*   translations: t, */
  onAvatarUpdate,
  onProfileUpdate,
  onBannerUpdate
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

  return (
    <section className="flex items-center gap-4">
      <Card className="w-full overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-40 dark:opacity-35"
          style={{
            backgroundImage: `url(${backgroundBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/75 to-background/85 dark:from-background/80 dark:via-background/70 dark:to-background/80" />
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
                <Img className="w-3 h-3" />
              </Button>
            }
            title="Cambiar Fondo"
            description="Personaliza el fondo sutil de tu header de cuenta"
          />
        </div>

        <CardContent className="flex items-center justify-between w-full relative z-10 py-4">

          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={currentAvatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`}
                alt="User avatar"
                className={`size-16 rounded-full object-cover bg-chart-4 ring-2 ring-primary/30 shadow-lg transition-all duration-300 ${isUpdating ? 'opacity-75 scale-95' : 'opacity-100 scale-100'
                  }`}
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/9.x/initials/svg?seed=${user.email}`
                }}
                width={32}
                height={32}
                fill
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

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold truncate text-foreground">
                  {getDisplayName(user)}
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">

                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 rounded-full border border-primary/30 backdrop-blur-sm">
                  <Settings className="w-3 h-3 text-primary" />
                  <p className="capitalize text-xs font-medium text-primary">
                    Cuenta
                    {/* {user.Account[0].type.toLowerCase()} {t.title} */}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/70 rounded-full border border-muted-foreground/30 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-muted-foreground/70 rounded-full" />
                  <p className="text-xs font-medium text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden md:flex items-center gap-4">

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-full border border-muted-foreground/20 backdrop-blur-sm">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Desde {formatJoinDate(user.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20 backdrop-blur-sm">
                <Shield className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Verificado
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ProfileEditor
                currentUsername={user.username}
                currentFirstName={user.first_name}
                currentLastName={user.last_name}
                currentPhone={user.phone!}
                onProfileUpdate={onProfileUpdate}
              />

           {/*    {user.Account[0].type === "FREE" && (
                <Button asChild size="sm" className="bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 text-xs h-8 px-4">
                  <Link href="/upgrade">
                    Actualizar Plan
                         {t["description.upgrade-plan"]}
                  </Link>
                </Button>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}