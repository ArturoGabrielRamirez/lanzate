export type PaymentMethod = 
  | 'CASH'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'TRANSFER'
  | 'MERCADO_PAGO'
  | 'PAYPAL'
  | 'CRYPTO'

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
  
  // Business hours
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
}

export type StoreOperationalSettingsForm = Omit<StoreOperationalSettings, 'id' | 'store_id' | 'created_at' | 'updated_at'>

export type GetOperationalSettingsReturn = {
  message: string
  payload: StoreOperationalSettings | null
  error: boolean
}

export type UpdateOperationalSettingsReturn = {
  message: string
  payload: StoreOperationalSettings | null
  error: boolean
} 