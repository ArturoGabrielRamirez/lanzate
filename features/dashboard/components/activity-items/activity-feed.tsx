import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserStoreActivities } from "@/features/dashboard/actions/getUserStoreActivities"
import { EmptyFeedItem, NewActivityFeed } from "@/features/dashboard/components"

type Props = {
    userId: number
    type: string
    page: number
}

async function ActivityFeed({ userId, type, page }: Props) {

    const { payload: activities, error } = await getUserStoreActivities(userId, type, page)


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


    if (activities.length === 0) {
        return <EmptyFeedItem />

    }

    return <NewActivityFeed initialActivities={activities} userId={userId} type={type} />
}

export default ActivityFeed