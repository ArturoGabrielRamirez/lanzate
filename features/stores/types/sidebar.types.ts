import type * as React from 'react'

export interface NavBtn {
  icon: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  active?: boolean
}
