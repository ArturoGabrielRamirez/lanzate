"use client"

import { useRef } from 'react'

import DangerZone from '@/features/account/components/delete-user/danger-zone'
import { DangerZoneTabProps } from '@/features/account/types'
import { DangerZoneRef } from '@/features/global/types'

export function DangerZoneTab({ userId, onStatusChange }: DangerZoneTabProps) {
  const dangerZoneRef = useRef<DangerZoneRef | null>(null)

  // Exponer globalmente para que los atajos puedan acceder
  if (typeof window !== 'undefined') {
    window.dangerZoneRef = dangerZoneRef
  }

  return (
    <div className="space-y-4">
      <DangerZone
        ref={dangerZoneRef}
        userId={userId}
        onStatusChange={onStatusChange}
      />
    </div>
  )
}