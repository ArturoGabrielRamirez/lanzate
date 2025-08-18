"use client"

import { useEffect, useState } from "react"
import * as motion from "motion/react-client"
import FeedItem from "./activity-items/feed-item"
import { Contract, ContractAssignment, Order, OrderTracking, Product, SocialActivity, Store, User } from "@prisma/client"
import EmptyFeedItem from "./empty-feed-item"

type Props = {
    initialActivities: (SocialActivity & { user: User, store: Store, product: Product, order: Order & { tracking: OrderTracking }, contract: ContractAssignment & { contract: Contract } })[]
    userId: number
}


function NewActivityFeed({ initialActivities }: Props) {
    const [activities/* , setActivities */] = useState(initialActivities)

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
                    event: 'INSERT',
                    schema: 'public',
                    table: "social_activities"
                },
                handleActivity
            )
            .subscribe()

        return () => {
            changes.unsubscribe()
        } */
    }, [])

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
            {activities.map((item) => {

                return <FeedItem item={item} key={item.id} />
            })}
        </motion.div>
    )
}

export default NewActivityFeed