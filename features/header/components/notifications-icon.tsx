"use client"

import { Notification } from "@/prisma/generated/prisma"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { getNotifications } from "../actions/getNotifications"
import { markNotificationAsRead } from "../actions/markNotificationAsRead"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"

type Props = {}

function NotificationsIcon({ }: Props) {

    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        const suscribe = async () => {
            const supabase = createClient()
            const { payload: user, error: userError, message: userMessage } = await getUserInfo()

            if (userError) {
                return console.error(userMessage)
            }

            const channel = supabase.channel("schema-db-changes")

            channel.on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "notifications",
                filter: `user_id=eq.${user.id}`
            }, handleShout).subscribe()
        }

        suscribe()
        getNotifications()
            .then((res) => {
                setNotifications(res.payload)
            })

    }, [])

    const handleShout = (payload: any) => {
        setNotifications(notifications => {
            return [...notifications, payload.new]
        })
    }

    const handleViewNotification = async (id: number) => {
        const { error } = await markNotificationAsRead(id)

        if (error) {
            return console.log(error)
        }

        setNotifications(notifications => {
            return notifications.filter(notification => notification.id !== id)
        })
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant={"outline"} className={cn(notifications.length > 0 && "!bg-red-500 relative")}>
                    <Bell />
                    {notifications.length > 0 && (
                        <Badge className="absolute -top-2 -right-2">
                            {notifications.length}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex justify-between">
                        <p>{notification.message}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewNotification(notification.id)} >
                            <Eye />
                        </Button>
                        <DropdownMenuSeparator />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default NotificationsIcon