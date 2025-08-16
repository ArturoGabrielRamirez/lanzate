"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import Link from "next/link"
import { ArrowRight, CalendarIcon } from "lucide-react"

export default function DashboardCalendar() {

    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <>
            <div className="flex items-center justify-between mb-2 md:mb-4 text-muted-foreground/50">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2">
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
            <Calendar
                id="step4"
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border w-full bg-gradient-to-br from-background to-transparent border-white/5 backdrop-blur-xs hover:from-primary/20 hover:to-transparent hover:!shadow-2xl transition-all"
            /* components={{
                DayButton: ({ day, modifiers }) => {
                    return (
                        <ButtonWithPopup
                            variant="ghost"
                            size="icon"
                            text={day.date.getDate().toString()}
                            title="Add reminder"
                            description="Add a reminder for this day"
                            contentButton="Confirm reminder"
                            action={() => { }}
                            messages={{
                                success: "Reminder added",
                                error: "Error adding reminder",
                                loading: "Adding reminder..."
                            }}
                        >
                            <InputField label="Reminder" name="reminder" />
                        </ButtonWithPopup>
                    )
                }
            }} */
            />

        </>
    )
}
