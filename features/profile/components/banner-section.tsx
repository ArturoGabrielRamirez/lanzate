import { Image } from "lucide-react"
import { Button } from "@/features/shadcn/components/ui/button"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"
import { PRESET_BANNERS } from "../utils/preset-banners"
import { BannerImage } from "./banner-image-memo"
import { BannerSectionProps } from "../types"
import { MediaSelector } from "@/features/shared/components/media-selector/components/media-selector"

export function BannerSection({
    bannerUrl,
    isLoading,
    hasError,
    onLoad,
    onError,
    onUpdate,
    isOwnProfile,
    loadingBanner,
    isMobile = false
}: BannerSectionProps) {
    const height = isMobile ? "h-36" : "h-60"
    const iconSize = isMobile ? "w-6 h-6" : "w-12 h-12"
    const buttonPosition = isMobile ? "bottom-2 right-2" : "bottom-4 right-4"

    return (
        <div className={`relative ${height} overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900`}>
            {loadingBanner ? (
                <Skeleton className="w-full h-full" />
            ) : (
                <>
                    <BannerImage
                        bannerUrl={bannerUrl}
                        isLoading={isLoading}
                        onLoad={onLoad}
                        onError={onError}
                    />
                    {hasError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                            <Image className={`${iconSize} opacity-50 text-white`} />
                        </div>
                    )}
                </>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {isOwnProfile && (
                <div className={`absolute ${buttonPosition}`}>
                    <MediaSelector
                        type="banner"
                        currentUrl={bannerUrl}
                        presets={PRESET_BANNERS}
                        onUpdate={onUpdate}
                        triggerButton={
                            isMobile ? (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="text-xs h-7 px-2 bg-black/40 backdrop-blur-md text-white border-white/30 hover:bg-black/50"
                                >
                                    <Image className="w-3 h-3 mr-1" />
                                    Banner
                                </Button>
                            ) : (
                                <Button
                                    variant="secondary"
                                    className="bg-black/40 backdrop-blur-md text-white border-white/30 hover:bg-black/50"
                                >
                                    <Image className="w-4 h-4 mr-2" />
                                    Cambiar Banner
                                </Button>
                            )
                        }
                        title="Cambiar Banner del Perfil"
                        description="Personaliza tu banner con cámara, recorte, subida de archivos o elige entre las opciones predefinidas"
                        allowRemove={true}
                    />
                </div>
            )}
        </div>
    )
}