import { StoragePath, UPLOAD_TYPES, UploadType } from "@/features/global/types/media"

export function getStoragePath(type: UploadType): StoragePath {
    switch (type) {
        case UPLOAD_TYPES.AVATAR:
            return { bucket: 'avatars' }
        case UPLOAD_TYPES.BANNER:
            return { bucket: 'banners' }
        case UPLOAD_TYPES.PRODUCT_IMAGE:
            return { bucket: 'product-images' }
        case UPLOAD_TYPES.PRODUCT_VIDEO:
            return { bucket: 'product-videos' }
        case UPLOAD_TYPES.STORE_LOGO:
            return { bucket: 'store-logos' }
        case UPLOAD_TYPES.STORE_BANNER:
            return { bucket: 'store-banners' }
        case UPLOAD_TYPES.MEDIA:
            return { bucket: 'media' }
        default:
            return { bucket: 'misc' }
    }
}