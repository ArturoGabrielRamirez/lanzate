"use client"

import { QuickActionsClientProps } from "@/features/dashboard/types"
import CreateStoreButtonNew from "@/features/stores/components/create-store-button-new"

function QuickActionsClient({ userId }: QuickActionsClientProps) {
    return (
        <div className="grow">
            {/* <CreateStoreButton userId={userId} /> */}
            <CreateStoreButtonNew userId={userId} />
        </div>
    )
}

export { QuickActionsClient }