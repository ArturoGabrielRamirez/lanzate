"use client"

import { Notification, PrismaClient } from "@/prisma/generated/prisma"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { getNotifications } from "../actions/getNotifications"

type Props = {}

function NotificationsIcon({ }: Props) {

    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {

        const handleShout = (payload: any) => {
            console.log("🚀 ~ handleShout ~ payload:", payload)
        }

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

    return (
        <button>
            🔔
        </button>
    )
}
export default NotificationsIcon