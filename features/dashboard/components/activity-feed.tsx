import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserStoreActivities } from "../actions/getUserStoreActivities"
import NewActivityFeed from "./new-activity-feed"
/* import EmptyFeedItem from "./empty-feed-item" */

type Props = {
    userId: number
    type: string
}

async function ActivityFeed({ userId, type }: Props) {

    const { payload: activities, error , message} = await getUserStoreActivities(userId, type)
    console.log("🚀 ~ ActivityFeed ~ message:", message)
    console.log("🚀 ~ ActivityFeed ~ error:", error)
    console.log("🚀 ~ ActivityFeed ~ activities:", activities)


    if (error || !activities) {
        return (
            <div className="bg-card rounded-lg border p-6">
                <CardHeader className="p-0 pb-4">
                    <CardTitle>
                        <h2 className="text-2xl font-bold">Actividad Reciente</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-muted-foreground">
                        No se pudo cargar la actividad reciente.
                    </p>
                </CardContent>
            </div>
        )
    }


    /* if (activities.length === 0) {
        return <EmptyFeedItem userId={userId} />

    } */

    return <NewActivityFeed initialActivities={activities} userId={userId} />
}

export default ActivityFeed