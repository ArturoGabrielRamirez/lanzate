"use client"

import { ArrowRight, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useMedia } from "react-use"

import { Calendar } from "@/components/ui/calendar"

function DashboardCalendar() {

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isClient, setIsClient] = useState(false)
    const isMobile = useMedia("(max-width: 768px)")

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (isMobile || !isClient) return null

    return (
        <div className="area-[calendar] hidden md:block group" suppressHydrationWarning>
            <div className="flex items-center justify-between mb-2 md:mb-4 text-primary/50">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2 group-hover:text-primary transition-all">
                    <CalendarIcon className="size-4 xl:size-5" />
                    Your events
                </h2>
                <Link
                    href="/events"
                    className="flex items-center gap-1 text-sm text-inherit hover:text-primary transition-colors"
                >
                    See all
                    <ArrowRight className="size-4" />
                </Link>
            </div>
            {isClient && (
                <Calendar
                    id="step4"
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border w-full  hover:from-primary/20 hover:to-transparent transition-all group not-dark:bg-gradient-to-br not-dark:to-background not-dark:from-transparent not-dark:to-120% border-white/5 backdrop-blur-sm hover:!shadow-2xl dark:via-background hover:border-primary/20 relative dark:hover:to-primary/20 dark:bg-card h-fit"
                />
            )}
        </div>
    )
}

export { DashboardCalendar }