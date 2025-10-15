import { PaymentMethod, Store } from "@prisma/client"

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