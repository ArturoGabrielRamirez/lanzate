import { getUserStoreActivitiesAction } from "@/features/dashboard/actions"
import { EmptyFeedItem, NewActivityFeed } from "@/features/dashboard/components"
import { ActivityFeedProps } from "@/features/dashboard/types"

async function ActivityFeed({ userId, type, page }: ActivityFeedProps) {

    const { payload: activities, hasError } = await getUserStoreActivitiesAction(userId, type, page)

    if (hasError || !activities) {
        return <EmptyFeedItem />
    }

    if (activities.length === 0) {
        return <EmptyFeedItem />

    }

    return <NewActivityFeed initialActivities={activities} userId={userId} type={type} />
}

export { ActivityFeed }