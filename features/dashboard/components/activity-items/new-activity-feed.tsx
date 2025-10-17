"use client"

import * as motion from "motion/react-client"
import { useEffect, useState } from "react"

import { getUserStoreActivities } from "@/features/dashboard/actions/get-user-store-activities.action"
import { FeedItem } from "@/features/dashboard/components/activity-items"
import { EmptyFeedItem } from "@/features/dashboard/components/activity-items"
import InfiniteScroll from "@/features/dashboard/components/infinite-scroll"
import { NewActivityFeedProps } from "@/features/dashboard/types"

function NewActivityFeed({ initialActivities, userId, type }: NewActivityFeedProps) {

    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const [activities, setActivities] = useState(initialActivities)



    /* const handleActivity = async (payload: RealtimePostgresChangesPayload<SocialActivityRecord>) => {
        try {

            if (payload.eventType !== 'INSERT' || !payload.new) {
                return
            }

            const { payload: completeActivity, error } = await getSocialActivityByIdAction(payload.new.id)

            if (error || !completeActivity) {
                console.error("Failed to fetch complete activity data:", error)
                throw error
            }

            setActivities(prev => [completeActivity, ...prev])
        } catch (error) {
            console.error("Error handling new activity:", error)
        }
    } */

    useEffect(() => {
        /* const supabase = createClient()

        const changes = supabase
            .channel('social-activities-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: "orders"
                },
                (payload) => {
                    console.log("📦 Activity change received:", payload)
                }
            )
            .subscribe((status) => {
                console.log("📡 Subscription status:", status)
            })

        return () => {
            changes.unsubscribe()
        } */
    }, [])

    const handleGetMoreActivities = async () => {
        setIsLoading(true)
        const { payload: newActivities, error } = await getUserStoreActivities(userId, type, currentPage)

        if (error || !newActivities) {
            setHasMore(false)
            setIsLoading(false)
            return
        }

        if (newActivities.length === 0) {
            setHasMore(false)
            setIsLoading(false)
            return
        }

        setActivities(prev => [...prev, ...newActivities])
        setCurrentPage(prev => prev + 1)
        setIsLoading(false)
    }

    if (activities.length === 0) {
        return (
            <EmptyFeedItem />
        )
    }

    return (
        <motion.div
            className="space-y-2 md:space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {activities.map((item, index) => {
                return <FeedItem item={item} key={index} />
            })}

            <InfiniteScroll
                isLoading={isLoading}
                hasMore={hasMore}
                next={handleGetMoreActivities}
            />
        </motion.div>
    )
}

export { NewActivityFeed }