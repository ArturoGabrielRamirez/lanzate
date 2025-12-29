import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, UPLOAD_TYPES, type UploadType } from '@/features/global/types/media'

export class ValidationError extends Error {
    constructor(message: string, public statusCode: number = 400) {
        super(message)
        this.name = 'ValidationError'
    }
}

export function validateUploadType(type: string | null): asserts type is UploadType {
    const allowedTypes = Object.values(UPLOAD_TYPES) as string[]

    if (!type || !allowedTypes.includes(type)) {
        throw new ValidationError(
            `El tipo de subida no es válido. Debe ser: ${allowedTypes.join(', ')}`
        )
    }
}

export function validateFile(file: File | null): asserts file is File {
    if (!file) {
        throw new ValidationError('No se proporcionó ningún archivo')
    }
}

export function validateFileSize(file: File): void {
    if (file.size > MAX_FILE_SIZE) {
        throw new ValidationError(
            `EL tamaño de la imagen supera el límite permitido. El límite es de ${MAX_FILE_SIZE / 1024}KB.`
        )
    }
}

export function validateFileType(file: File): { isVideo: boolean; isImage: boolean } {
    const isVideo = file.type.startsWith('video/')
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])

    if (!isVideo && !isImage) {
        throw new ValidationError(
            `Tipo no permitido. Solo imágenes: ${ALLOWED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ')} o videos`
        )
    }

    return { isVideo, isImage }
}

export function validatePresetType(type: UploadType): void {
    if (!([UPLOAD_TYPES.AVATAR, UPLOAD_TYPES.BANNER] as UploadType[]).includes(type)) {
        throw new ValidationError('Presets solo disponibles para avatar y banner')
    }
}

export function validatePresetData(data: unknown): asserts data is { type: string; presetUrl: string } {
    if (typeof data !== 'object' || data === null || !('presetUrl' in data) || !('type' in data)) {
        throw new ValidationError('URL de preset y tipo son requeridos')
    }
}