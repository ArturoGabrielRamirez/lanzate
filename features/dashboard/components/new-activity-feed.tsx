"use client"

import { useEffect, useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialActivityFeedItem, ActivityFeedItem } from "../types"
import {
    LikeActivityCard,
    CommentActivityCard,
    OrderActivityCard,
    ContractEmployeeActivityCard,
    /* ContractOwnerActivityCard */
} from "./activity-items"
import * as motion from "motion/react-client"
import { createClient } from "@/utils/supabase/client"
import { getSocialActivityByIdAction } from "../actions/getSocialActivityById"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

type Props = {
    initialActivities: SocialActivityFeedItem[]
    userId: number
}

// Type for the social activity record from Supabase
type SocialActivityRecord = {
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
}

function NewActivityFeed({ initialActivities }: Props) {
    const [activities, setActivities] = useState<SocialActivityFeedItem[]>(initialActivities)

    // Function to handle new activity updates
    const handleActivity = async (payload: RealtimePostgresChangesPayload<SocialActivityRecord>) => {
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
    }

    useEffect(() => {
        const supabase = createClient()

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
        }
    }, [])

    if (activities.length === 0) {
        return (
            <div className="bg-card rounded-lg border p-6">
                <CardHeader className="p-0 pb-4">
                    <CardTitle>
                        <h2 className="text-2xl font-bold">Actividad Reciente</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="text-center py-8">
                        <div className="mb-4">
                            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-muted-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">¡Bienvenido a tu dashboard!</h3>
                        <p className="text-muted-foreground mb-4">
                            Aquí podrás ver toda la actividad reciente de tu tienda, incluyendo likes, comentarios, pedidos y contratos.
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            Cuando tengas actividad, aparecerá aquí automáticamente.
                        </p>
                    </div>
                </CardContent>
            </div>
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
                const baseDelay = index * 0.1

                switch (item.activity_type) {
                    case 'PRODUCT_LIKE':
                        return (
                            <motion.div
                                key={item.id}
                            >
                                <LikeActivityCard item={item as ActivityFeedItem & { type: 'PRODUCT_LIKE' }} />
                            </motion.div>
                        )
                    case 'PRODUCT_COMMENT':
                        return (
                            <motion.div
                                key={item.id}
                            >
                                <CommentActivityCard item={item as ActivityFeedItem & { type: 'PRODUCT_COMMENT' }} />
                            </motion.div>
                        )
                    case 'ORDER_CREATED':
                        return (
                            <motion.div
                                key={item.id}
                            >
                                <OrderActivityCard item={item as ActivityFeedItem & { type: 'ORDER_CREATED' }} />
                            </motion.div>
                        )
                    case 'CONTRACT_REJECTED':
                        return (
                            <motion.div
                                key={item.id}
                            >
                                <ContractEmployeeActivityCard item={item as ActivityFeedItem & { type: 'CONTRACT_REJECTED' }} />
                            </motion.div>
                        )
                    default:
                        return null
                }
            })}
        </motion.div>
    )
}

export default NewActivityFeed