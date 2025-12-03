"use client"

import { SecurityCard } from "@/features/account/components"
import { UserType } from "@/features/account/types"

export function SecurityTab({ user }: { user: UserType }) {
    return (
        <div className="space-y-4">
            <SecurityCard user={user} />
        </div>
    )
}