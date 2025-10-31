import { MediaType } from "@prisma/client"

import { UPLOAD_TYPES, UploadType } from "@/features/global/types/media"

export function getMediaType(uploadType: UploadType, fileType: string): MediaType | null {
    if (uploadType === UPLOAD_TYPES.PRODUCT_VIDEO || fileType.startsWith('video/')) {
        return MediaType.VIDEO
    }
    if (uploadType === UPLOAD_TYPES.PRODUCT_IMAGE || fileType.startsWith('image/')) {
        return MediaType.IMAGE
    }
    return null
}