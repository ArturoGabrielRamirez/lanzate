import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserStoreActivities } from "../actions/getUserStoreActivities"
import { ActivityFeedItem, UserStoreActivity } from "../types"
import {
    LikeActivityCard,
    CommentActivityCard,
    OrderActivityCard,
    ContractEmployeeActivityCard,
    ContractOwnerActivityCard
} from "./activity-items"
import * as motion from "motion/react-client"

type Props = {
    userId: number
}

function renderActivityCard(item: ActivityFeedItem, index: number) {
    const baseDelay = index * 0.1

    switch (item.type) {
        case 'like':
            return (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: baseDelay }}
                >
                    <LikeActivityCard item={item as ActivityFeedItem & { type: 'like' }} />
                </motion.div>
            )
        case 'comment':
            return (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: baseDelay }}
                >
                    <CommentActivityCard item={item as ActivityFeedItem & { type: 'comment' }} />
                </motion.div>
            )
        case 'order':
            return (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: baseDelay }}
                >
                    <OrderActivityCard item={item as ActivityFeedItem & { type: 'order' }} />
                </motion.div>
            )
        case 'contract_assignment_as_employee':
            return (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: baseDelay }}
                >
                    <ContractEmployeeActivityCard item={item as ActivityFeedItem & { type: 'contract_assignment_as_employee' }} />
                </motion.div>
            )
        case 'contract_assignment_as_owner':
            return (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: baseDelay }}
                >
                    <ContractOwnerActivityCard item={item as ActivityFeedItem & { type: 'contract_assignment_as_owner' }} />
                </motion.div>
            )
        default:
            return null
    }
}

async function ActivityFeed({ userId }: Props) {
    const { payload: activities, error } = await getUserStoreActivities(userId)

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

    // Combine and sort activities
    const feedItems: ActivityFeedItem[] = [
        ...activities.likes.map((like: UserStoreActivity['likes'][0]) => ({
            id: `like-${like.user_id}-${like.product_id}`,
            type: 'like' as const,
            user: like.users,
            product: like.products,
            created_at: like.created_at
        })),
        ...activities.comments.map((comment: UserStoreActivity['comments'][0]) => ({
            id: `comment-${comment.id}`,
            type: 'comment' as const,
            user: comment.users,
            product: comment.products,
            content: comment.content,
            created_at: comment.created_at
        })),
        ...activities.orders.map((order: UserStoreActivity['orders'][0]) => ({
            id: `order-${order.id}`,
            type: 'order' as const,
            user: order.customer || { id: 0, first_name: order.customer_name || 'Cliente', last_name: '', avatar: null },
            order: order,
            created_at: order.created_at
        })),
        ...activities.contractAssignmentsAsEmployee.map((assignment: UserStoreActivity['contractAssignmentsAsEmployee'][0]) => ({
            id: `contract-employee-${assignment.id}`,
            type: 'contract_assignment_as_employee' as const,
            user: assignment.assigned_by_user,
            contract: assignment.contract,
            status: assignment.status,
            created_at: assignment.assigned_at
        })),
        ...activities.contractAssignmentsAsOwner.map((assignment: UserStoreActivity['contractAssignmentsAsOwner'][0]) => ({
            id: `contract-owner-${assignment.id}`,
            type: 'contract_assignment_as_owner' as const,
            user: assignment.assigned_by_user,
            contract: assignment.contract,
            employee: assignment.employee.user,
            status: assignment.status,
            created_at: assignment.assigned_at
        }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    if (feedItems.length === 0) {
        return (
            <div className="bg-card rounded-lg border p-6">
                <CardHeader className="p-0 pb-4">
                    <CardTitle>
                        <h2 className="text-2xl font-bold">Actividad Reciente</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-muted-foreground">
                        No hay actividad reciente.
                    </p>
                </CardContent>
            </div>
        )
    }

    return (
        <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {feedItems.slice(0, 10).map((item, index) => renderActivityCard(item, index))}
        </motion.div>
    )
}

export default ActivityFeed 