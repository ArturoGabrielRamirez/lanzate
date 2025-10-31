import { useState, useEffect } from 'react'

import { ImageInfo } from '@/features/profile/types'

export function useImageInfo(isOpen: boolean, imageFile: File | null) {
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)

    useEffect(() => {
        if (isOpen && imageFile) {
            const img = new window.Image()
            const previewUrl = URL.createObjectURL(imageFile)

            img.onload = () => {
                setImageInfo({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    size: imageFile.size,
                    previewUrl
                })
            }

            img.src = previewUrl

            return () => {
                URL.revokeObjectURL(previewUrl)
            }
        } else {
            setImageInfo(null)
        }
    }, [isOpen, imageFile])

    return imageInfo
}