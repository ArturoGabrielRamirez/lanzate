import { PaymentMethod, Store, SocialActivity, User, Product, Order, OrderTracking, ContractAssignment, Contract } from "@prisma/client"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

import { LocalUserType } from "@/features/auth/types"

type BaseStoreInfo = Pick<Store, "id" | "name" | "description" | "logo" | "slogan" | "slug" | "subdomain" | "created_at" | "updated_at" | "user_id">

export type DashboardStore = BaseStoreInfo & { _count: { products: number } }

export type DashboardStoreStats = {
  storeCount: number
  productCount: number
  operationalSettingsCount: number
  stores: DashboardStore[]
}

export interface StoreListProps {
  stores: DashboardStore[]
  userId: number
  mandatoryAddMore?: boolean
}

export type BusinessHours = {
  monday_open?: string
  monday_close?: string
  tuesday_open?: string
  tuesday_close?: string
  wednesday_open?: string
  wednesday_close?: string
  thursday_open?: string
  thursday_close?: string
  friday_open?: string
  friday_close?: string
  saturday_open?: string
  saturday_close?: string
  sunday_open?: string
  sunday_close?: string
}

export type StoreOperationalSettings = {
  id: number
  store_id: number

  // Delivery settings
  offers_delivery: boolean
  delivery_price?: number
  free_delivery_minimum?: number
  delivery_radius_km?: number

  // Delivery and pickup times
  delivery_time_min?: number
  delivery_time_max?: number
  pickup_time_min?: number
  pickup_time_max?: number

  // Payment methods
  payment_methods: PaymentMethod[]

  // Additional settings
  requires_phone_for_delivery: boolean
  minimum_order_amount?: number
  preparation_time_buffer?: number
  is_temporarily_closed: boolean
  temporary_closure_reason?: string

  // Contact info
  contact_phone?: string
  contact_whatsapp?: string
  contact_email?: string

  // Instructions
  delivery_instructions?: string
  pickup_instructions?: string
  special_notes?: string

  created_at: Date
  updated_at: Date
} & BusinessHours

export type StoreOperationalSettingsForm = Omit<StoreOperationalSettings, 'id' | 'store_id' | 'created_at' | 'updated_at'>

// Component Props Types
export type StepStatus = 'disabled' | 'active' | 'complete'

export type DashboardStepsProps = {
  userId: number
  dashboardData: DashboardStoreStats
}

export type DashboardStepCardProps = {
  stepNumber: number
  title: string
  description: string
  icon: LucideIcon
  status: StepStatus
  children?: React.ReactNode
  footer?: React.ReactNode
  cardClassName?: string
}

export type QuickActionsProps = {
  userId: number
}

export type QuickActionsClientProps = {
  userId: number
}

export type ConfigureStoreOperationsButtonProps = {
  userId: number
  stores: DashboardStore[]
}

export type CreateProductForStoreButtonProps = {
  userId: number
  stores: DashboardStore[]
}

export type ContractActionButtonsProps = {
  fileUrl: string
  title: string
}

export type ContractResponseButtonsProps = {
  assignmentId: number
  onResponse?: () => void
}

export type ShareStoreLinkProps = {
  stores: DashboardStore[]
}

export type ActivityFeedProps = {
  userId: number
  type: string
  page: number
}

type ActivityUser = Pick<User, 'id' | 'email' | 'avatar' | 'first_name' | 'last_name' | 'username'>

type ActivityStore = Pick<Store, 'id' | 'name' | 'slug'>

export type ActivityWithRelations = SocialActivity & {
  user: ActivityUser
  store: ActivityStore | null
  product: Product | null
  order: (Order & { tracking: OrderTracking | null }) | null
  contract?: (ContractAssignment & { contract: Contract }) | null
}

export type NewActivityFeedProps = {
  initialActivities: ActivityWithRelations[]
  userId: number
  type: string
}

export type FeedItemProps = {
  item: ActivityWithRelations
}

export type CommentActivityCardProps = {
  item: SocialActivity & { user: User, store: Store, product: Product & { store: Store } }
}

export type OrderActivityCardProps = {
  item: SocialActivity & { user: User, store: Store, order: Order }
}

export type LikeActivityCardProps = {
  item: SocialActivity & { user: User, store: Store, product: Product }
}

export type ActivityFeedItem = {
  id: string
  user: User
  contract?: {
    title: string
    comments?: string
    file_url?: string
    store: Store
  }
  status?: string
  created_at: Date
  employee?: User
}

export type ContractEmployeeActivityCardProps = {
  item: ActivityFeedItem & { type: 'contract_assignment_as_employee' }
}

export type ContractOwnerActivityCardProps = {
  item: ActivityFeedItem & { type: 'contract_assignment_as_owner' }
}

export type DashboardStatsProps = {
  userId: number
}

export type InfiniteScrollProps = {
  isLoading: boolean
  hasMore: boolean
  next: () => void
}

export type WelcomeWidgetProps = {
  user: LocalUserType
}

export type SettingsLinksProps = {
  stores: Store[]
}

export type CopyLinkProps = {
  stores: Store[]
}

export type ChangeIndicatorProps = {
  change: number
}

export type DashboardErrorProps = {
  message: string
}

export type StoreCardSkeletonProps = {
  index: number
}

export type FeedErrorProps = {
  message: string
}

export type DashboardStatCardSkeletonProps = {
  index: number
  stat: {
    title: string
    icon: React.ComponentType<{ className?: string }>
  }
}

export type ActivityFeedItemSkeletonProps = {
  index: number
}

export type ExtractLinkItem = SocialActivity & {
  store: ActivityStore | null
  product: Product | null 
  order: Order | null  
}

export interface PageHeaderProps {
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  breadcrumbs?: { label: string, href: string }[]
  media?: React.ReactNode | string
}

export interface PageHeaderPropsFixed extends Omit<PageHeaderProps, 'subtitle'> {
  subtitle?: string | ReactNode
}