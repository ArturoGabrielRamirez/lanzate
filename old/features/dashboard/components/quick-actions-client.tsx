"use client"

/* import CreateStoreButton from "@/features/stores/components/create-store-button" */
import CreateStoreButtonNew from "@/features/stores/components/create-store-button-new"

type QuickActionsClientProps = {
    userId: number
}

function QuickActionsClient({ userId }: QuickActionsClientProps) {
    return (
        <div className="grow">
            {/* <CreateStoreButton userId={userId} /> */}
            <CreateStoreButtonNew userId={userId} />
        </div>
    )
}

export default QuickActionsClient 