import { OverviewTab } from "@/features/overview/components"
import { OverviewTabProps } from "@/features/overview/types/types"

function AnalyticsTab({ slug, userId }: OverviewTabProps) {
    return (
        <OverviewTab slug={slug} userId={userId} />
    )
}

export default AnalyticsTab