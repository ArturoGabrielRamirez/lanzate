"use client"

import { useEffect, useState } from "react"
/* import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityFeedItem } from "../types"
import {
    LikeActivityCard,
    CommentActivityCard,
    OrderActivityCard,
    ContractEmployeeActivityCard,
    ContractOwnerActivityCard
} from "./activity-items" */
import * as motion from "motion/react-client"
/* import { createClient } from "@/utils/supabase/client" */
/* import { getSocialActivityByIdAction } from "../actions/getSocialActivityById"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js" */
import FeedItem from "./activity-items/feed-item"
import { Contract, ContractAssignment, Order, Product, SocialActivity, Store, User } from "@prisma/client"
import EmptyFeedItem from "./empty-feed-item"

type Props = {
    initialActivities: (SocialActivity & { user: User, store: Store, product: Product, order: Order, contract: ContractAssignment & { contract: Contract } })[]
    userId: number
}

// Type for the social activity record from Supabase
/* type SocialActivityRecord = {
    id: number
    user_id: number
    store_id: number | null
    activity_type: string
    entity_type: string
    entity_id: number
    title: string
    description: string | null
    metadata: string | null
    is_public: boolean
    is_featured: boolean
    created_at: string
    updated_at: string
} */

function NewActivityFeed({ initialActivities }: Props) {
    console.log("🚀 ~ NewActivityFeed ~ initialActivities:", initialActivities)
    const [activities/* , setActivities */] = useState(initialActivities)

    // Function to handle new activity updates
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