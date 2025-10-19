

import { FileValidationOptions } from '@/features/profile/types'
import { User, Store, ProductMedia } from '@prisma/client'



// Agregar al final de tu archivo de tipos existente

export interface CameraComponentProps {
  isOpen: boolean
  onCapture: (file: File) => void  // ✅ Solo 1 parámetro (el componente lo espera así)
  onClose: () => void
  onRetake?: () => void
  aspectRatio?: number
  title?: string
  maxWidth?: number
  maxHeight?: number
  quality?: number
}
export interface UseUploadHistoryReturn {
  uploads: string[]
  addUpload: (url: string) => void
  removeUpload: (url: string) => void
  canUploadMore: boolean
}
export interface UseMediaUploadReturn {
  // Estados principales
  isUploading: boolean
  uploadProgress: number
  isLoadingPreset: boolean
  selectedFile: File | null
  capturedFile: CapturedFile | null
  previewUrl: string | null
  hasSelectedFile: boolean
  hasPreview: boolean
  isFromCamera: boolean
  needsCropping: boolean

  // Estados de componentes
  isCameraOpen: boolean
  isCropperOpen: boolean
  showCropDialog: boolean
  showBackgroundRemover: boolean
  fileForCropping: File | null
  pendingFile: File | null
  pendingFileForBgRemoval: File | null

  // Métodos de selección
  handleFileSelect: (file: File) => Promise<boolean>
  openFileSelector: () => void

  // Métodos de cámara
  openCamera: () => void
  closeCamera: () => void
  retakePhoto: () => void

  // Métodos de upload
  uploadSelectedFile: () => Promise<void> | void
  usePreset: (url: string) => Promise<void>
  cancelUpload: () => void

  // Métodos de cropping
  openCropper: () => Promise<void>  // ← ✅ NUEVO: Agregado aquí
  handleCropComplete: (croppedFile: File) => void

  // Métodos de optimización
  handleOptimizationDecision: (decision: 'crop' | 'resize' | 'keep') => void
  handleOptimizationDialogClose: () => void

  // Métodos de background remover
  openBackgroundRemover: () => void
  handleBackgroundRemoved: (processedFile: File) => void

  // Métodos generales
  resetState: () => void
  getCurrentPreview: () => string | null

  // Props para componentes
  cameraProps: CameraComponentProps
  fileInputProps: {
    ref: React.RefObject<HTMLInputElement | null>
    type: 'file'
    accept: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    style: { display: string }
    multiple: boolean
  }
  cropperProps: ImageCropperProps
  backgroundRemoverProps: BackgroundRemoverProps


  // Configuración
  resolvedValidationOptions: FileValidationOptions
  uploadHistory: UseUploadHistoryReturn
}

export interface ImageCropperProps {
  isOpen: boolean
  onClose: () => void
  imageFile: File | null
  aspectRatio?: number
  onCropComplete: (croppedFile: File) => void
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

export interface AvatarOption {
  id: string
  url: string
  provider: string
  label: string
  icon: string
  isCurrentlyUsed?: boolean
}

export interface BannerOption {
  id: string
  url: string
  provider: string
  label: string
  icon: string
  isCurrentlyUsed?: boolean
  fileName?: string
  size?: number
  uploadedAt?: string
}

export interface PresetOption {
  id: string | number
  url: string
  name: string
  icon?: string
}

export interface MediaSelectorProps {
  type: MediaType
  currentUrl: string | null
  presets?: PresetOption[]
  onUpdate: (url: string | null) => void
  triggerButton?: React.ReactNode
  title?: string
  description?: string
  allowRemove?: boolean
  className?: string
  loadApiAvatars?: boolean
  userEmail?: string
}

export interface UploadProgressProps {
  progress: number
  isUploading: boolean
  fileName?: string
  fileSize?: string
  onCancel?: () => void
  success?: boolean
  className?: string
}


export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
] as const

export const UPLOAD_TYPES = {
  AVATAR: 'avatar',
  BANNER: 'banner',
  PRODUCT_IMAGE: 'product-image',
  PRODUCT_VIDEO: 'product-video',
  STORE_LOGO: 'store-logo',
  STORE_BANNER: 'store-banner',
  MEDIA: 'media'
} as const

export type UploadType = typeof UPLOAD_TYPES[keyof typeof UPLOAD_TYPES]

export interface StoragePath {
  bucket: string
  folder?: string
}

export type UserUploadResponse = Pick<User, 'id' | 'username' | 'avatar' | 'banner'>

export type StoreUploadResponse = Pick<Store, 'id' | 'name' | 'logo' | 'banner' | 'slug'>

export type ProductMediaResponse = Pick<ProductMedia, 'id' | 'product_id' | 'type' | 'url' | 'alt_text' | 'sort_order' | 'created_at'>

export interface UploadResult {
  message: string
  url: string
  filename?: string
  originalSize?: number
  username: string
  user?: UserUploadResponse | null
  store?: StoreUploadResponse | null
  media?: ProductMediaResponse | null
  type: UploadType
}

export interface DeleteResult {
  message: string
  user?: UserUploadResponse
  username?: string
}


export interface PresetRequest {
  type: UploadType
  presetUrl: string
}

export interface FileUploadData {
  file: File
  type: UploadType
  productId?: number | null
  storeId?: number | null
}

export interface DeleteRequest {
  type: UploadType
  mediaId?: number
  productId?: number
  storeId?: number
}

// Tipo para usuario simplificado
export interface SimpleUser {
  id: number
  username: string
}

// Tipo para getCurrentUser response
export interface CurrentUserResponse {
  payload: {
    id: string | number
  }
  error?: string
}

export interface MediaPreviewProps {
  type: 'avatar' | 'banner'
  previewUrl: string | null
}

export interface BackgroundRemoverProps {
  isOpen: boolean
  onClose: () => void
  imageFile: File | null
  onProcessed: (file: File) => void
}

export type MediaType = 'avatar' | 'banner'

export interface UploadFileOptions {
  file: File
  type: MediaType
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

export interface UploadPresetOptions {
  presetUrl: string
  type: MediaType
  onProgress?: (progress: number) => void
}


export type UploadMethod = 'file' | 'camera' | 'preset'

export interface UseUploadManagerOptions {
  type: MediaType
  onSuccess?: (url: string, method: UploadMethod) => void
  onError?: (error: string) => void
}


export interface CapturedFile {
  file: File
  preview: string
  timestamp: number
}

export interface UseMediaUploadOptions {
  type: MediaType
  onSuccess?: (url: string, method: UploadMethod) => void
  onError?: (error: string) => void
  validationOptions?: FileValidationOptions
  autoRevalidate?: boolean
}

export interface ValidationOptions {
  /** Tamaño máximo del archivo en bytes */
  maxFileSize?: number
  /** Ancho máximo en píxeles */
  maxWidth?: number
  /** Alto máximo en píxeles */
  maxHeight?: number
  /** Ancho mínimo en píxeles */
  minWidth?: number
  /** Alto mínimo en píxeles */
  minHeight?: number
  /** Tipos MIME permitidos */
  allowedTypes?: string[]
  /** Aspect ratio esperado (opcional) */
  aspectRatio?: number
  /** Tolerancia para aspect ratio */
  aspectRatioTolerance?: number
}

export interface UseCameraCaptureProps {
  type: 'avatar' | 'banner'
  validationOptions: ValidationOptions
  onCapture?: (file: File) => void
}

export interface UseFileSelectionProps {
  validationOptions: ValidationOptions
  onValidationError?: (error: string) => void
  onNeedsCropping?: (file: File) => void
  onNeedsOptimization?: (file: File) => void
}

export interface UseFileUploadProps {
  type: 'avatar' | 'banner'
  onSuccess?: (url: string, method: UploadMethod) => void
  onError?: (error: string) => void
}

export interface UseImageCropperProps {
  aspectRatio: number
  maxWidth?: number
  maxHeight?: number
  onCropComplete?: (croppedFile: File) => void
}

export interface UseImageOptimizationProps {
  validationOptions: ValidationOptions
  onOptimized?: (file: File, method: 'crop' | 'resize' | 'keep') => void
  onNeedsCropping?: (file: File) => void
}


