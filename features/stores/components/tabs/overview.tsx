import { OverviewTab } from "@/features/overview/components"
import { OverviewTabProps } from "@/features/overview/types"

async function Overview({ slug, userId }: OverviewTabProps) {
    return <OverviewTab slug={slug} userId={userId} />
}

export default Overview