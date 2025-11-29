import Image from "next/image"
import { memo } from "react"

import { Skeleton } from "@/features/shadcn/components/ui/skeleton"

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
        <Image
            src={bannerUrl}
            alt="Banner del perfil"
            sizes="100vw"
            className="object-cover transition-all duration-300 size-8"
            onLoad={onLoad}
            onError={onError}
            priority
            unoptimized={true}
        />
    )
})

BannerImage.displayName = 'BannerImage'

export { BannerImage }