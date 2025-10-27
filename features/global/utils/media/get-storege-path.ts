import { StoragePath, UPLOAD_TYPES, UploadType } from "@/features/global/types/media"

export function getStoragePath(type: UploadType): StoragePath {
    switch (type) {
        case UPLOAD_TYPES.AVATAR:
            return { bucket: 'user-uploads', folder: 'avatars' }
        case UPLOAD_TYPES.BANNER:
            return { bucket: 'user-uploads', folder: 'banners' }
        case UPLOAD_TYPES.PRODUCT_IMAGE:
        case UPLOAD_TYPES.PRODUCT_VIDEO:
            return { bucket: 'product-images' }
        case UPLOAD_TYPES.STORE_LOGO:
            return { bucket: 'store-logos' }
        case UPLOAD_TYPES.STORE_BANNER:
            return { bucket: 'store-banners' }
        case UPLOAD_TYPES.MEDIA:
            return { bucket: 'user-uploads', folder: 'media' }
        default:
            return { bucket: 'user-uploads', folder: 'misc' }
    }
}