import { Camera } from "lucide-react"
import { memo } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/features/shadcn/components/ui/avatar"
import { Button } from "@/features/shadcn/components/ui/button"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"
import { MediaSelector } from "@/features/shared/components/media-selector/components/media-selector"


const ProfileAvatar = memo(({
    avatarUrl,
    displayName,
    isLoading,
    isOwnProfile,
    onAvatarUpdate,
    userEmail,
    size = 'large'
}: {
    avatarUrl: string | null
    displayName: string
    isLoading: boolean
    isOwnProfile: boolean
    onAvatarUpdate?: (url: string | null) => void
    userEmail?: string | null
    size?: 'medium' | 'large'
}) => {
    const sizeClasses = {
        medium: "w-20 h-20",
        large: "w-32 h-32"
    }

    const textSizes = {
        medium: "text-xl",
        large: "text-2xl"
    }

    if (isLoading) {
        return <Skeleton className={`${sizeClasses[size]} rounded-full border-4 border-white shadow-xl`} />
    }

    return (
        <div className="relative">
            <Avatar className={`${sizeClasses[size]} border-4 border-white shadow-xl ring-2 ring-white/20`}>
                <AvatarImage
                    src={avatarUrl || undefined}
                    alt={displayName}
                    loading="eager"
                    className="object-cover"
                />
                <AvatarFallback className={`bg-gradient-to-br from-orange-400 to-orange-600 text-white ${textSizes[size]} font-bold`}>
                    {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            {/* Controles del avatar para usuarios propios - USANDO MediaSelector completo */}
            {isOwnProfile && (
                <MediaSelector
                    type="avatar"
                    currentUrl={avatarUrl}
                    onUpdate={onAvatarUpdate || (() => { })}
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
        </div>
    )
})

ProfileAvatar.displayName = 'ProfileAvatar'

export { ProfileAvatar }