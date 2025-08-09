import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Clock } from "lucide-react"
import { ActivityFeedItem } from "../../types"
import Link from "next/link"
import { getUserInitials, formatActivityDate } from "./shared-utils"

type Props = {
    item: ActivityFeedItem & { type: 'comment' }
}

function CommentActivityCard({ item }: Props) {
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
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                    {item.user.first_name} {item.user.last_name}
                                </span>
                                <span className="text-muted-foreground text-xs md:text-sm">comentó en</span>
                                <Link
                                    href={`/stores/${item.product?.store.slug}/products/${item.product?.id}`}
                                    className="font-medium text-primary hover:underline"
                                >
                                    {item.product?.name}
                                </Link>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.content}</p>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground justify-between">
                            <div className="flex items-center space-x-1">
                                <MessageCircle className="h-3 w-3 text-white fill-current" />
                                <span className="text-muted-foreground">
                                    en{' '}
                                    <Link
                                        href={`/stores/${item.product?.store.slug}/overview`}
                                        className="text-primary hover:underline"
                                    >
                                        {item.product?.store.name}
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

export default CommentActivityCard 