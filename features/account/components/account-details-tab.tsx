"use client"

import { useEffect, useState } from "react"
import { AccountDetailsTabProps } from "../types"
import { BasicInfoCard, SecurityCard, SecuritySkeleton, StatsCard } from "."

export function AccountDetailsTab({ user, translations: t, immediateData }: AccountDetailsTabProps) {
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