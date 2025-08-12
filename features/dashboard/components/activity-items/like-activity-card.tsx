"use client"

import { Flame, Clock } from "lucide-react"
import { ActivityFeedItem } from "../../types"
import Link from "next/link"
import { formatActivityDate } from "./shared-utils"
import { Avatar, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

type Props = {
    item: ActivityFeedItem & { type: 'like' }
}

function LikeActivityCard({ item }: Props) {
    return (
        <Card isPressable className="w-full">
            <div className="absolute inset-0 bg-primary/10 blur-md -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
            <CardHeader className="flex gap-3">
                <Avatar
                    showFallback
                    src={item.user.avatar || undefined}
                    alt={`${item.user.first_name} ${item.user.last_name}`}
                    name={`${item.user.first_name} ${item.user.last_name}`}
                />
                <p className="text-muted-foreground text-sm">
                    @{item.user.username}
                </p>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
                <div className="flex items-end gap-1 text-lg">
                    <p className="md:hidden flex items-center gap-1 text-inherit">
                        <Flame className="size-3 text-red-500 fill-current" />
                        <span className="text-inherit">a</span>
                    </p>
                    <p className="text-muted-foreground/50 text-xs md:text-sm lg:text-lg hidden md:flex md:items-center gap-1">le dio <Flame className="size-3 text-red-500 fill-current" /> a</p>
                    <Link
                        href={`/stores/${item.product?.store.slug}/products/${item.product?.id}`}
                        className="font-medium text-primary hover:underline text-sm md:text-base"
                    >
                        {item.product?.name}
                    </Link>
                </div>
            </CardBody>
            <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-1">
                    <span className="text-muted-foreground/50">
                        en{' '}
                        <Link
                            href={`/stores/${item.product?.store.slug}/overview`}
                            className="text-primary hover:underline"
                        >
                            {item.product?.store.name}
                        </Link>
                    </span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground/50">
                    <Clock className="h-3 w-3" />
                    <span>{formatActivityDate(item.created_at)}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

export default LikeActivityCard 