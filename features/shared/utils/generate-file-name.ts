import { UploadType } from "@/features/shared/types/types"

export function generateFileName(type: UploadType, userId: number, extension: string): string {
    const timestamp = Date.now()
    return `${type}-${userId}-${timestamp}.${extension}`
}