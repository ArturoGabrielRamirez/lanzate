// 📁 features/shared/components/media-selector/types.ts
import { PresetOption, UseMediaUploadReturn, MediaType, MediaPreviewProps } from "@/features/shared/types"

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
