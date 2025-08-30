"use client"

import { Suspense, lazy, useEffect } from "react"
import { DangerZoneSkeleton } from "./danger-zone-skeleton"
import { DangerZoneTabProps } from "../types"
const DangerZoneOriginal = lazy(() => import("./delete-user/danger-zone"))

export default function DangerZoneTab({ userId, onStatusChange, preload }: DangerZoneTabProps) {
  useEffect(() => {
    if (preload) {
      import("./delete-user/danger-zone")
    }
  }, [preload])

  return (
    <Suspense fallback={<DangerZoneSkeleton />}>
      <DangerZoneOriginal userId={userId} onStatusChange={onStatusChange} />
    </Suspense>
  )
}
