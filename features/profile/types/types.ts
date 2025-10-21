// ==========================================
// features/profile/types.ts - VERSIÓN CORREGIDA Y UNIFICADA
// ==========================================
import { ReactNode } from "react"

// ===== TIPOS BASE DE USUARIO =====

export interface CurrentUser {
  id: number  // ✅ SIEMPRE número de Prisma
  username: string
  email: string
  avatar?: string | null
  banner?: string | null
  first_name?: string | null
  last_name?: string | null
  supabase_user_id?: string | null
  created_at: Date | string
  profile_is_public?: boolean
}
export type GetUserActivitiesParams = {
  userId: number
  limit?: number
  offset?: number
  includePrivate?: boolean
}

// ===== TIPOS DE PERFIL =====

export interface PublicUserProfile {
  id: number
  username: string
  email: string
  first_name?: string | null
  last_name?: string | null
  avatar?: string | null
  banner?: string | null
  profile_bio?: string | null
  location?: string | null
  profile_is_public: boolean
  show_liked_products: boolean
  show_comments: boolean
  show_activity: boolean
  show_location: boolean
  supabase_user_id?: string | null
  created_at: Date | string
  _count: {
    user_follows_following: number // followers
    user_follows: number // following
    product_likes: number
  }
}

export interface UpdateProfileData {
  first_name?: string | null
  last_name?: string | null
  profile_bio?: string | null
  location?: string | null
  profile_is_public?: boolean
  show_liked_products?: boolean
  show_comments?: boolean
  show_activity?: boolean
  show_location?: boolean
}

export interface UserProfileInfo {
  id: number
  banner?: string | null
  avatar?: string | null
  username: string
  first_name?: string | null
  last_name?: string | null
  email: string
  created_at: Date | string
  profile_bio?: string | null
  location?: string | null
  show_location?: boolean
}

/* export interface UserInfo {
  id: number
  username: string
  first_name?: string | null
  last_name?: string | null
  email: string
  avatar?: string | null
  banner?: string | null
  phone?: string | null
  supabase_user_id?: string
  Account: Array<{ type: string }>
  created_at: Date | string
} */

// ===== PROPS DE COMPONENTES =====
/* export interface PublicProfileClientProps {
  user: PublicUserProfile
  initialCurrentUser?: CurrentUser | null
  initialIsFollowing: boolean // ✅ SIEMPRE requerido desde servidor
}
 */

export interface ProfileBannerProps {
  user: UserProfileInfo
  currentUserId?: number // ✅ SIEMPRE número
  currentUsername?: string
  onBannerUpdate?: (url: string | null) => void
  onAvatarUpdate?: (url: string | null) => void
  isOwnProfile: boolean
  loadingBanner?: boolean
  loadingAvatar?: boolean
  actionButton?: ReactNode
}

export interface ProfileSettingsFormProps {
  user: PublicUserProfile
  onClose?: () => void
}

export interface ProfileActionButtonProps {
  isUserLoading: boolean
  isOwnProfile: boolean
  showFollowButton: boolean
  isFollowing: boolean
  isFollowLoading: boolean
  onFollowToggle: () => void
  user: PublicUserProfile
  currentUser: CurrentUser | null
}

export interface PrivateProfileViewProps {
  reason: string
  currentUser: CurrentUser | null  // ✅ CAMBIADO: Usa CurrentUser
  isUserLoading: boolean
}

export interface ProfileTabsProps {
  user: PublicUserProfile
  isOwnProfile: boolean
  currentUserId?: string | number
}

export interface CommunityStatsProps {
  followersCount: number
  followingCount: number
  likesCount: number
  accountAge: number
  isOwnProfile: boolean
  userType?: 'customer' | 'admin'
}

export interface ProfileInfoProps {
  displayName: string
  username: string
  bio?: string | null
  location?: string | null
  showLocation?: boolean
  createdAt: Date | string
  isMobile?: boolean
}

export interface ProfileBannerDesktopProps {
  user: UserProfileInfo
  displayName: string
  bannerUrl: string
  avatarUrl: string | null
  bannerState: {
    isLoading: boolean
    hasError: boolean
    handleLoad: () => void
    handleError: () => void
  }
  loadingBanner: boolean
  loadingAvatar: boolean
  isOwnProfile: boolean
  onBannerUpdate: (url: string | null) => void
  onAvatarUpdate: (url: string | null) => void
  actionButton?: ReactNode
}

export interface ProfileBannerMobileProps {
  user: UserProfileInfo
  displayName: string
  bannerUrl: string
  avatarUrl: string | null
  bannerState: {
    isLoading: boolean
    hasError: boolean
    handleLoad: () => void
    handleError: () => void
  }
  loadingBanner: boolean
  loadingAvatar: boolean
  isOwnProfile: boolean
  onBannerUpdate: (url: string | null) => void
  onAvatarUpdate: (url: string | null) => void
  actionButton?: ReactNode
}

export interface ProfileSettingsFormProps {
  user: PublicUserProfile
}

// ===== TIPOS DE ACTIVIDADES =====

export type SocialActivityType =
  | 'PRODUCT_LIKE'
  | 'PRODUCT_COMMENT'
  | 'ORDER_CREATED'
  | 'ORDER_COMPLETED'
  | 'USER_REGISTERED'
  | 'USER_LOGIN' // TODO: Cambiar a USER_FOLLOW cuando actualices schema

/* export type SocialActivityType =
  | 'PRODUCT_LIKE'
  | 'PRODUCT_COMMENT'
  | 'ORDER_CREATED'
  | 'ORDER_COMPLETED'
  | 'CONTRACT_ASSIGNED'
  | 'CONTRACT_APPROVED'
  | 'CONTRACT_REJECTED'
  | 'EMPLOYEE_HIRED'
  | 'EMPLOYEE_FIRED'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'STORE_CREATED'
  | 'STORE_UPDATED'
  | 'TRANSACTION_CREATED'
  | 'REMINDER_COMPLETED'
  | 'USER_REGISTERED'
  | 'USER_LOGIN'
 /*  | 'USER_FOLLOW'  */ // ✅ AGREGADO
/*  | 'STORE_REVIEW'
 | 'PRODUCT_REVIEW'
 | 'ACHIEVEMENT_UNLOCKED'
 | 'MILESTONE_REACHED' */

export type EntityType =
  | 'USER'
  | 'STORE'
  | 'PRODUCT'
  | 'ORDER'
  | 'BRANCH'
  | 'CATEGORY'
  | 'TAG'
  | 'STOCK'
  | 'TRANSACTION'
  | 'EMPLOYEE'
  | 'SETTINGS'
  | 'EMAIL_CHANGE_REQUEST'

export interface UserActivity {
  id: string | number
  user_id: number
  store_id?: number | null
  activity_type: SocialActivityType
  entity_type: string
  entity_id: number | null
  title: string
  description?: string | null
  metadata?: string | null
  is_public: boolean
  is_featured: boolean
  created_at: Date | string
  product?: {
    id: number
    name: string
    image?: string | null
    slug: string
  } | null
  store?: {
    id: number
    name: string
    logo?: string | null
    slug: string
  } | null
}


export interface UserActivitiesProps {
  userId: number
  isOwnProfile?: boolean
  showPrivateActivities?: boolean
}

// ===== TIPOS DE PRODUCTOS =====

export interface LikedProduct {
  user_id: number
  product_id: number
  created_at: Date | string
  product: {
    id: number
    name: string
    description?: string | null
    price: number
    image?: string | null
    slug: string
    is_active: boolean
    is_deleted?: boolean
    store: {
      id: number
      name: string
      logo?: string | null
      slug: string
    }
  }
}

export interface UserLikedProductsProps {
  userId: number
  isOwnProfile?: boolean
}

export interface ProductImageProps {
  src?: string | null
  alt: string
}

export interface ProductBadgesProps {
  isActive: boolean
}

export interface ProductInfoProps {
  name: string
  description?: string | null
  price: number
  storeName: string
  likedAt: string | Date
}

export interface ProductCardProps {
  likedProduct: LikedProduct
}

export interface ProductsGridProps {
  products: LikedProduct[]
}

// ===== TIPOS DE FOLLOWS =====

export interface UserFollow {
  id: number
  follower_id: number
  following_id: number
  created_at: Date | string
  follower?: Partial<PublicUserProfile>
  following?: Partial<PublicUserProfile>
}

export interface FollowStats {
  followersCount: number
  followingCount: number
  isFollowing: boolean
}

// ===== TIPOS DE IMÁGENES =====

export interface ImageInfo {
  width: number
  height: number
  size: number
  previewUrl: string
}

export interface ImagePreviewProps {
  previewUrl: string
  width: number
  height: number
  size: number
  type: 'avatar' | 'banner'
}

export interface OptimizationDialogProps {
  isOpen: boolean
  onDecision: (decision: 'crop' | 'resize' | 'keep') => void
  imageFile: File | null
  onClose: () => void
  type: 'avatar' | 'banner'
  maxWidth?: number
  maxHeight?: number
}

export interface OptimizationOptionsListProps {
  onDecision: (decision: 'crop' | 'resize' | 'keep') => void
  isMuchLarger: boolean
  isLargeFile: boolean
}

export interface OptimizationOptionProps {
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  title: string
  description: string
  badges?: Array<{
    label: string
    variant?: 'secondary' | 'outline'
    icon?: React.ComponentType<{ className?: string }>
  }>
  features: string[]
  onClick: () => void
}

export interface RecommendationBannerProps {
  type: 'avatar' | 'banner'
  recommendedWidth: number
  recommendedHeight: number
  isLargeFile: boolean
}

export interface BannerSectionProps {
  bannerUrl: string
  isLoading: boolean
  hasError: boolean
  onLoad: () => void
  onError: () => void
  onUpdate: (url: string | null) => void
  isOwnProfile: boolean
  loadingBanner: boolean
  isMobile?: boolean
}

// ===== TIPOS DE CHALLENGES Y GAMIFICACIÓN =====

export interface Challenge {
  id: string
  title: string
  description: string
  progress: number
  max: number
  reward: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export interface ChallengeCardProps {
  challenge: Challenge
}

export interface ChallengesSectionProps {
  challenges: Challenge[]
}

export interface LevelCardProps {
  level: {
    name: string
    level: number
    icon: React.ComponentType<{ className?: string }>
    color: string
    bgColor: string
    borderColor: string
  }
  points: number
  progressData: {
    nextLevelName: string
    progress: number
    pointsNeeded: number
  }
}

// ===== TIPOS DE STATS =====

export interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  color: string
  bgColor: string
  showProgress?: boolean
  maxValue?: number
}

export interface StatsGridProps {
  followersCount: number
  followingCount: number
  likesCount: number
  accountAge: number
}

// ===== TIPOS DE API =====

export interface ApiResponse<T> {
  success: boolean
  payload?: T
  error?: string
  message?: string
}

export interface FollowResponse {
  isFollowing: boolean
  followersCount?: number
}

export interface ProfileUpdateResponse {
  user: PublicUserProfile
  message: string
}

// ===== TIPOS DE ESTADOS =====

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

export interface ErrorStateProps {
  message: string
}

// ===== CONTEXT =====

export interface UserContextType {
  user: CurrentUser | null
  isLoading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  updateUserField: (field: keyof CurrentUser, value: string | null) => void
  updateAvatar: (url: string | null) => void
  updateBanner: (url: string | null) => void
  updateProfile: (data: Partial<CurrentUser>) => void
}

export interface UserProviderProps {
  children: ReactNode
  initialUser?: CurrentUser | null
}

// features/profile/types.ts - AGREGAR esta propiedad
export interface PublicProfileClientProps {
  user: PublicUserProfile
  initialCurrentUser?: CurrentUser | null
  initialIsFollowing?: boolean // ✅ AGREGAR ESTA LÍNEA
}

export interface FileValidationOptions {
  maxSize?: number
  allowedTypes?: string[]
  maxWidth?: number
  maxHeight?: number
  allowCropping?: boolean
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  needsCropping: boolean
  shouldOptimize: boolean
  originalDimensions?: { width: number; height: number }
  fileSize: number
}

export interface ProfilePermissions {
  isOwnProfile: boolean
  canViewProfile: boolean
  showFollowButton: boolean
  reason?: string
}

export interface WarningBannerProps {
  isMuchLarger: boolean
}