"use client"

import CreateStoreButton from "@/features/stores/components/create-store-button"

type QuickActionsClientProps = {
    userId: number
}

function QuickActionsClient({ userId }: QuickActionsClientProps) {
    return (
        <div className="grow">
            <CreateStoreButton userId={userId} />
        </div>
    )
}

export default QuickActionsClient 