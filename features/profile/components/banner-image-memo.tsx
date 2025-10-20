import { Skeleton } from "@/features/shadcn/components/ui/skeleton"
import { memo } from "react"

export const BannerImage = memo(({
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