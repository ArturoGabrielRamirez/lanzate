import type * as React from 'react'

export interface NavBtn {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}
