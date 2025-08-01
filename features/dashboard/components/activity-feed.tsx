import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserStoreActivities } from "../actions/getUserStoreActivities"
import { Heart, MessageCircle, Clock, Flame } from "lucide-react"
import { ActivityFeedItem, UserStoreActivity } from "../types"
import Link from "next/link"
import { formatDistance } from "date-fns"
import { es } from "date-fns/locale"

type Props = {
    userId: number
}

function getUserInitials(firstName?: string | null, lastName?: string | null) {
    if (!firstName && !lastName) return "U"
    
    const first = firstName?.charAt(0) || ""
    const last = lastName?.charAt(0) || ""
    
    return (first + last).toUpperCase() || "U"
}

function formatActivityDate(date: Date) {
    return formatDistance(date, new Date(), { 
        addSuffix: true, 
        locale: es 
    })
}

async function ActivityFeed({ userId }: Props) {
    const { payload: activities, error } = await getUserStoreActivities(userId)

    if (error || !activities) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-2xl font-bold">Actividad Reciente</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        No se pudo cargar la actividad reciente.
                    </p>
                </CardContent>
            </Card>
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
        }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    if (feedItems.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-2xl font-bold">Actividad Reciente</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                            Aún no hay actividad en tus tiendas.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Los likes y comentarios de tus productos aparecerán aquí.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">Actividad Reciente</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-135 overflow-y-auto">
                {feedItems.slice(0, 10).map((item) => (
                    <div key={item.id} className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage 
                                    src={item.user.avatar || undefined} 
                                    alt={`${item.user.first_name} ${item.user.last_name}`} 
                                />
                                <AvatarFallback>
                                    {getUserInitials(item.user.first_name, item.user.last_name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="font-semibold">
                                        {item.user.first_name} {item.user.last_name}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {item.type === 'like' ? 'le dio like a' : 'comentó en'}
                                    </span>
                                    <Link 
                                        href={`/stores/WLEIAxpn/products/${item.product.id}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {item.product.name}
                                    </Link>
                                </div>
                                
                                {item.type === 'comment' && item.content && (
                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-sm">{item.content}</p>
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        {item.type === 'like' ? (
                                            <Flame className="h-3 w-3 text-red-500 fill-current" />
                                        ) : (
                                            <MessageCircle className="h-3 w-3 text-white fill-current" />
                                        )}
                                        <span className="text-muted-foreground">
                                            en {item.product.store.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatActivityDate(item.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {feedItems.indexOf(item) < feedItems.slice(0, 10).length - 1 && (
                            <div className="border-b border-muted"></div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default ActivityFeed 