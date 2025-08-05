"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
/* import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarClock } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog" */
/* import { ButtonWithPopup, InputField } from "@/features/layout/components" */

export default function DashboardCalendar() {

    const [date, setDate] = useState<Date | undefined>(new Date())
    /* const [isReminderOpen, setIsReminderOpen] = useState(false) */


    /* const handleReminderOpenChange = () => {
        setIsReminderOpen(true)
    } */

    return (
        <>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border w-full"
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
