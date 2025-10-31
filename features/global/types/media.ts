

import { User, Store, ProductMedia } from '@prisma/client'
import { Dispatch, RefObject, SetStateAction } from "react"


import { FileValidationOptions } from '@/features/profile/types'


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
    id: number | undefined | string
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

export type EditMode = 'none' | 'erase' | 'restore'

export interface CanvasEditorState {
  editMode: EditMode
  brushSize: number
  opacity: number
  zoom: number
  isDrawing: boolean
  historyStack: ImageData[]
  historyIndex: number
  canvasInitialized: boolean
  canvasRef: RefObject<HTMLCanvasElement>
  compareCanvasRef: RefObject<HTMLCanvasElement>

}

export interface BackgroundRemoverProps {
  isOpen: boolean
  onClose: () => void
  imageFile: File | null
  onProcessed: (file: File) => void
}

export interface UseCanvasEditorProps {
  previewUrl: string | null
  processedBlob: Blob | null
  isOpen: boolean
}

export interface InitialPreviewProps {
  originalUrl: string | null
}

export interface ProcessingViewProps {
  progress: number
}

export interface EditorViewProps {
  originalUrl: string | null
  editor: CanvasEditorReturn
}

export interface ActionButtonsProps {
  hasProcessedBlob: boolean
  isProcessing: boolean
  isOptimizing: boolean
  canvasInitialized: boolean
  imageFile: File | null
  onClose: () => void
  onRemoveBackground: () => Promise<void>
  onConfirm: () => Promise<void>
}

export interface CanvasEditorReturn {
  editMode: EditMode
  setEditMode: Dispatch<SetStateAction<EditMode>>
  brushSize: number
  setBrushSize: Dispatch<SetStateAction<number>>
  opacity: number
  setOpacity: Dispatch<SetStateAction<number>>
  zoom: number
  setZoom: Dispatch<SetStateAction<number>>
  isDrawing: boolean
  setIsDrawing: Dispatch<SetStateAction<boolean>>
  historyIndex: number
  historyStack: ImageData[]
  canvasInitialized: boolean
  canvasRef: RefObject<HTMLCanvasElement | null>
  compareCanvasRef: RefObject<HTMLCanvasElement | null>
  drawOnCanvas: (
    e: React.MouseEvent<HTMLCanvasElement>,
    hiddenCanvas: HTMLCanvasElement,
    visibleCanvas: HTMLCanvasElement
  ) => void
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  resetCanvas: () => void
  cleanup: () => void
  previewUrl: string | null
  handleDrawStart: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handleDrawMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handleDrawEnd: () => void
}

export interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  canvasInitialized: boolean
  zoom: number
  editMode: EditMode
  isDrawing: boolean
  onDrawStart: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onDrawMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onDrawEnd: () => void
}

export interface CompareViewProps {
  originalUrl: string | null
  editor: CanvasEditorReturn
}

export interface EditViewProps {
  editor: CanvasEditorReturn
}

export interface EditorControlsProps {
  brushSize: number
  onBrushSizeChange: (size: number) => void
  zoom: number
  onZoomChange: (zoom: number) => void
  disabled?: boolean
}

export interface EditorToolbarProps {
  editMode: EditMode
  onEditModeChange: (mode: EditMode) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
  disabled?: boolean
}

export interface UseBackgroundRemoverProps {
  onProcessed?: (processedFile: File) => void
}



// ============================================
// Media Options (API Loading)
// ============================================

export interface MediaOption {
  id: string
  url: string
  label: string
  icon?: string
}

export interface UseMediaOptionsProps {
  type: MediaType
  loadApiAvatars: boolean
}

export interface UseMediaOptionsReturn {
  apiAvatars: MediaOption[]
  apiBanners: MediaOption[]
  isLoadingAvatars: boolean
  isLoadingBanners: boolean
  avatarLoadError: string | null
  bannerLoadError: string | null
  loadAvatarOptions: () => void
  loadBannerOptions: () => void
}

// ============================================
// Component Props
// ============================================

export interface MediaSelectorTriggerProps {
  triggerButton?: React.ReactNode
  defaultTitle: string
  className?: string
}

export interface MediaSelectorContentProps {
  type: MediaType
  previewUrl: string | null
  currentUrl: string | null
  allOptions: PresetOption[]
  mediaOptions: UseMediaOptionsReturn
  mediaUpload: UseMediaUploadReturn  // ✅ Tipado con tu tipo existente
  allowRemove: boolean
  isActionDisabled: boolean
  showUploadButton: boolean
  onRemove: () => void
  onCancel: () => void
}

export interface MediaSelectorDialogsProps {
  type: MediaType
  mediaUpload: UseMediaUploadReturn  // ✅ Tipado con tu tipo existente
}

// ============================================
// Child Component Props (Ya los tienes definidos)
// ============================================

export interface UploadOptionsProps {
  hasSelectedFile: boolean
  isDisabled: boolean
  onFileSelect: () => void
  onCameraOpen: () => void
  onBackgroundRemove: () => void
}

export interface PresetOptionsProps {
  type: MediaType
  options: PresetOption[]
  isLoading: boolean
  loadError: string | null
  isDisabled: boolean
  onRetry: () => void
  onSelect: (url: string) => void
}

export interface ActionButtonsProps {
  allowRemove: boolean
  hasCurrentUrl: boolean
  hasSelectedFile: boolean
  isFromCamera: boolean
  isDisabled: boolean
  onRemove: () => void
  onCancel: () => void
  onUpload: () => void
}

// ============================================
// Utilities
// ============================================

export interface RemoveMediaOptions {
  showConfirm?: boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export interface UsePresetLoaderProps {
  type: MediaType
  loadApiAvatars?: boolean
  presets?: PresetOption[]
  isDialogOpen: boolean
}

export interface UsePresetLoaderReturn {
  allOptions: PresetOption[]
  isLoadingAvatars: boolean
  isLoadingBanners: boolean
  avatarLoadError: string | null
  bannerLoadError: string | null
  reloadAvatars: () => Promise<void>
  reloadBanners: () => Promise<void>
}

export interface DeleteMediaParams {
  type: 'avatar' | 'banner'
  mediaId?: number
}

export interface UpdateMediaPresetParams {
  type: 'avatar' | 'banner'
  presetUrl: string
}

export interface DeleteMediaParams {
  type: 'avatar' | 'banner'
  mediaUrl?: string
  mediaId?: number
}

export interface GetUserUploadsParams {
  type: 'avatar' | 'banner'
}

export interface CollapsiblePresetsProps {
  type: MediaType
  options: PresetOption[]
  onSelect: (url: string) => void
  isDisabled: boolean
}

export interface MediaPreviewWithRemoveProps extends MediaPreviewProps {
  onRemove?: () => void
  showRemove?: boolean
}

export interface AvatarLayoutProps {
  previewUrl: string | null
  showUploadButton: boolean
  uploadLimitReached: boolean
  isActionDisabled: boolean
  uploadsCount: number
  myFiles: Array<{ id: string; url: string; name: string }>
  allOptions: PresetOption[]
  isGalleryLoading: boolean
  galleryError: string | null
  mediaUpload: UseMediaUploadReturn
  mediaOptions: UseMediaOptionsReturn
  onToolClick: (tool: string) => void
  onClearPreview: () => void
}

export interface GalleryTabProps {
  type: 'avatar' | 'banner'
  previewUrl: string | null
  allOptions: PresetOption[]
  mediaOptions: UseMediaOptionsReturn
  mediaUpload: UseMediaUploadReturn
  isActionDisabled: boolean
}


export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
}

export interface EmptyStateProps {
  type: 'empty' | 'loading' | 'error'
  mediaType: 'avatar' | 'banner'
  message?: string
  onAction?: () => void
  actionLabel?: string
  disabled?: boolean
}

export interface MediaGridProps {
  items: Array<PresetOption | { id?: string; url: string; name?: string }>
  type: 'avatar' | 'banner'
  onSelect: (url: string) => void | Promise<void>
  onDelete?: (url: string) => void | Promise<void>
  selectedUrl: string | null
}

export interface BannerLayoutProps {
  previewUrl: string | null
  showUploadButton: boolean
  uploadLimitReached: boolean
  isActionDisabled: boolean
  uploadsCount: number
  myFiles: Array<{ id: string; url: string; name: string }>
  allOptions: PresetOption[]
  isGalleryLoading: boolean
  galleryError: string | null
  mediaUpload: UseMediaUploadReturn
  mediaOptions: UseMediaOptionsReturn
  onToolClick: (tool: string) => void
  onClearPreview: () => void
}

export interface MyFilesTabProps {
  type: 'avatar' | 'banner'
  previewUrl: string | null
  mediaUpload: UseMediaUploadReturn
  isActionDisabled: boolean
}

export interface ToolButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  disabled?: boolean
  color?: 'default' | 'camera' | 'crop' | 'ai'
  compact?: boolean
}

export interface UploadTabProps {
  mediaUpload: UseMediaUploadReturn
  isActionDisabled: boolean
  uploadLimitReached: boolean
}

export type GetUserUploadsResponse = {
  uploads: string[]
  count: number
}

export type DeleteMediaResponse = {
  mediaId?: number
  user?: {
    avatar: string | null
    banner: string | null
    id: number
    username: string
  }
  deletedFromStorage?: boolean
}