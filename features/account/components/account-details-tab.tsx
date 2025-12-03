"use client"
import { BasicInfoCard } from "@/features/account/components"
import { AccountDetailsTabProps } from "@/features/account/types"

export function AccountDetailsTab({
    user,
    immediateData,
    onProfileUpdate
}: AccountDetailsTabProps) {
    return (
        <div className="space-y-4">
            <BasicInfoCard
                user={user}
                immediateData={immediateData}
                onProfileUpdate={onProfileUpdate}
            />
        </div>
    )
}