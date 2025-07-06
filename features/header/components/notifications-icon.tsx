"use client"

import { Notification } from "@/prisma/generated/prisma"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { getNotifications } from "../actions/getNotifications"

type Props = {}

function NotificationsIcon({ }: Props) {

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const suscribe = async () => {
            const supabase = await createSupabaseClient()
            const channel = supabase.channel("schema-db-changes")

            channel.on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "notifications",
                filter: `user_id=eq.${1}`
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

    const handleOpenNotifications = () => {
        setIsOpen(!isOpen)
    }






    return (
        <>
            <button onClick={handleOpenNotifications}>
                🔔{notifications.length}
            </button>
            {isOpen && (
                <div>
                    {notifications.map((notification) => (
                        <div key={notification.id}>
                            {notification.message}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
export default NotificationsIcon