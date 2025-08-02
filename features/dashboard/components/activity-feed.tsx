import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getUserStoreActivities } from "../actions/getUserStoreActivities"
import { MessageCircle, Clock, Flame, FileText } from "lucide-react"
import { ActivityFeedItem, UserStoreActivity } from "../types"
import Link from "next/link"
import { formatDistance } from "date-fns"
import { es } from "date-fns/locale"
import ContractResponseButtons from "./contract-response-buttons"
import ContractActionButtons from "./contract-action-buttons"

type Props = {
    userId: number
}

function getUserInitials(firstName?: string | null, lastName?: string | null) {
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return (first + last).toUpperCase()
}

function formatActivityDate(date: Date) {
    return formatDistance(new Date(date), new Date(), {
        addSuffix: true,
        locale: es
    })
}

function getStatusBadgeVariant(status: string) {
    switch (status) {
        case 'PENDING':
            return 'secondary'
        case 'APPROVED':
            return 'default'
        case 'REJECTED':
            return 'destructive'
        case 'COMPLETED':
            return 'default'
        case 'EXPIRED':
            return 'outline'
        default:
            return 'secondary'
    }
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
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-2xl font-bold">Actividad Reciente</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        No hay actividad reciente.
                    </p>
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
            <CardContent className="space-y-4">
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
                                {item.type === 'like' && (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">
                                            {item.user.first_name} {item.user.last_name}
                                        </span>
                                        <span className="text-muted-foreground">le dio like a</span>
                                        <Link 
                                            href={`/stores/${item.product?.store.slug}/products/${item.product?.id}`}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {item.product?.name}
                                        </Link>
                                    </div>
                                )}
                                
                                {item.type === 'comment' && (
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">
                                                {item.user.first_name} {item.user.last_name}
                                            </span>
                                            <span className="text-muted-foreground">comentó en</span>
                                            <Link 
                                                href={`/stores/${item.product?.store.slug}/products/${item.product?.id}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {item.product?.name}
                                            </Link>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.content}</p>
                                    </div>
                                )}

                                {item.type === 'contract_assignment_as_employee' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">
                                                {item.user.first_name} {item.user.last_name}
                                            </span>
                                            <span className="text-muted-foreground">te asignó el contrato</span>
                                            <span className="font-medium text-primary">
                                                {item.contract?.title}
                                            </span>
                                            <Badge variant={getStatusBadgeVariant(item.status || 'PENDING')} className="text-xs">
                                                {item.status}
                                            </Badge>
                                        </div>
                                        
                                        {item.contract?.comments && (
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Comentarios:</strong> {item.contract.comments}
                                            </p>
                                        )}

                                        <ContractActionButtons 
                                            fileUrl={item.contract?.file_url || ''}
                                            title={item.contract?.title || 'contrato'}
                                        />

                                        {item.status === 'PENDING' && (
                                            <ContractResponseButtons 
                                                assignmentId={parseInt(item.id.split('-')[2])}
                                            />
                                        )}
                                    </div>
                                )}

                                {item.type === 'contract_assignment_as_owner' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">
                                                Asignaste el contrato
                                            </span>
                                            <span className="font-medium text-primary">
                                                {item.contract?.title}
                                            </span>
                                            <span className="text-muted-foreground">a</span>
                                            <span className="font-medium">
                                                {item.employee?.first_name} {item.employee?.last_name}
                                            </span>
                                            <Badge variant={getStatusBadgeVariant(item.status || 'PENDING')} className="text-xs">
                                                {item.status}
                                            </Badge>
                                        </div>
                                        
                                        {item.contract?.comments && (
                                            <p className="text-sm text-muted-foreground">
                                                <strong>Comentarios:</strong> {item.contract.comments}
                                            </p>
                                        )}

                                        <ContractActionButtons 
                                            fileUrl={item.contract?.file_url || ''}
                                            title={item.contract?.title || 'contrato'}
                                        />
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        {item.type === 'like' ? (
                                            <Flame className="h-3 w-3 text-red-500 fill-current" />
                                        ) : item.type === 'comment' ? (
                                            <MessageCircle className="h-3 w-3 text-white fill-current" />
                                        ) : (
                                            <FileText className="h-3 w-3 text-blue-500" />
                                        )}
                                        <span className="text-muted-foreground">
                                            en {item.type.includes('contract') ? item.contract?.store.name : item.product?.store.name}
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