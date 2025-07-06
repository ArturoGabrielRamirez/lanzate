"use client"

import { PrismaClient } from "@/prisma/generated/prisma"
import { createSupabaseClient } from "@/utils/supabase/client"
import { useEffect } from "react"
import { getNotifications } from "../actions/getNotifications"

type Props = {}

function NotificationsIcon({ }: Props) {

    

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
                console.log("🚀 ~ suscribe ~ res:", res)
            })

    }, [])

    return (
        <button>
            🔔
        </button>
    )
}
export default NotificationsIcon