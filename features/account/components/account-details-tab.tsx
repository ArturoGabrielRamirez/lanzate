"use client"

import { useEffect, useState } from "react"

import { BasicInfoCard, SecurityCard, SecuritySkeleton, StatsCard } from "@/features/account/components"
import { AccountDetailsTabProps } from "@/features/account/types"

export function AccountDetailsTab({ user, immediateData }: AccountDetailsTabProps) {
    const [securityVisible, setSecurityVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setSecurityVisible(true)
        }, 200)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="space-y-4">
            <BasicInfoCard user={user} immediateData={immediateData} />
            {securityVisible ? (
                <SecurityCard user={user} />
            ) : (
                <SecuritySkeleton />
            )}

            <StatsCard user={user} immediateData={immediateData} />
        </div>
    )
}