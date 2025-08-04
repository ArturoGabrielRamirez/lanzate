"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export default function DashboardCalendar() {

    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border w-full"
                components={{
                    DayButton: ({ day, modifiers }) => {
                        return (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="rounded-full" size="sm">
                                        {day.date.getDate()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    Events and reminders coming soon!
                                </PopoverContent>
                            </Popover>
                        )
                    }
                }}
            />

        </>
    )
}
