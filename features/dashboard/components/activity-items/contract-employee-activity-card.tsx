import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock } from "lucide-react"
import { ActivityFeedItem } from "../../types"
import Link from "next/link"
import { getUserInitials, formatActivityDate, getStatusBadgeVariant } from "./shared-utils"
import ContractResponseButtons from "../contract-response-buttons"
import ContractActionButtons from "../contract-action-buttons"

type Props = {
    item: ActivityFeedItem & { type: 'contract_assignment_as_employee' }
}

function ContractEmployeeActivityCard({ item }: Props) {
    return (
        <Card className="p-4 space-y-3">
            <CardContent className="p-0 space-y-3">
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
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                    {item.user.first_name} {item.user.last_name}
                                </span>
                                <span className="text-muted-foreground text-xs md:text-sm">te asignó el contrato</span>
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

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground justify-between">
                            <div className="flex items-center space-x-1">
                                <FileText className="h-3 w-3 text-blue-500" />
                                <span className="text-muted-foreground">
                                    en{' '}
                                    <Link
                                        href={`/stores/${item.contract?.store.slug}/overview`}
                                        className="text-primary hover:underline"
                                    >
                                        {item.contract?.store.name}
                                    </Link>
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatActivityDate(item.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ContractEmployeeActivityCard 