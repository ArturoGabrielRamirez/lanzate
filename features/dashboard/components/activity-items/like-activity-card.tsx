import { Flame, Clock } from "lucide-react"
import * as motion from "motion/react-client"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatActivityDate, getUserInitials } from "@/features/dashboard/utils/shared-utils"
import { LikeActivityCardProps } from "@/features/dashboard/types"

function LikeActivityCard({ item }: LikeActivityCardProps) {
    const displayName = item.user.username || `${item.user.first_name} ${item.user.last_name}`
    const userName = item.user.first_name
    const userLastName = item.user.last_name
    /*  const userPhone = item.user.phone || 'Sin numero' */
    /*   const userEmail = item.user.email */

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
        >
            <div className="absolute inset-0 border-primary group-hover:border-1 rounded-lg blur-sm"></div>
            <Card className="h-full group not-dark:bg-gradient-to-br not-dark:to-background not-dark:from-transparent not-dark:to-120% border-white/5 backdrop-blur-sm hover:!shadow-2xl dark:via-background hover:border-white/40 relative dark:hover:to-primary/20 dark:bg-card">
                <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={item.user?.avatar || undefined}
                                alt={`${item.user?.first_name} ${item.user?.last_name}`}
                            />
                            <AvatarFallback>
                                {getUserInitials(item.user?.email || '')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <div>
                                <p className="font-medium text-primary">
                                    @{item.user?.username}
                                </p>
                                <div className="flex items-end gap-1">
                                    <p className="md:hidden flex items-center gap-1">
                                        <Flame className="size-3 text-red-500 fill-current" />
                                        a
                                    </p>
                                    <p className="text-muted-foreground text-xs md:text-sm hidden md:flex md:items-center gap-1">le dio <Flame className="size-3 text-red-500 fill-current" /> a</p>

                                    <Link
                                        href={`/stores/${item.store.slug}/products/${item.product?.id}`}
                                        className="font-medium text-primary hover:underline text-sm md:text-base"
                                    >
                                        {item.product?.name}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground justify-between">
                                <div className="flex items-center space-x-1">
                                    <span className="text-muted-foreground">
                                        en{' '}
                                        <Link
                                            href={`/stores/${item?.store?.slug}/overview`}
                                            className="text-primary hover:underline"
                                        >
                                            {item?.store?.name}
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
        </motion.div>
    )
}

export { LikeActivityCard }