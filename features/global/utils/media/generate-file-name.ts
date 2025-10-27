import { UploadType } from "@/features/global/types/media"

export function generateFileName(type: UploadType, userId: number, extension: string): string {
    const timestamp = Date.now()
    return `${type}-${userId}-${timestamp}.${extension}`
}