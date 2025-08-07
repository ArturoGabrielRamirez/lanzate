import { OverviewTab } from "@/features/overview/components"
import { OverviewTabProps } from "@/features/overview/types"

function AnalyticsTab({ slug, userId }: OverviewTabProps) {
    return (
        <div>
            <OverviewTab slug={slug} userId={userId} />
        </div>
    )
}
export default AnalyticsTab