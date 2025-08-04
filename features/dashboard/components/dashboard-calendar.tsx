"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CalendarClock } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function DashboardCalendar() {

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isReminderOpen, setIsReminderOpen] = useState(false)


    const handleReminderOpenChange = () => {
        setIsReminderOpen(true)
    }

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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="rounded-full" size="sm">
                                        {day.date.getDate()}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem onClick={handleReminderOpenChange}>
                                                <CalendarClock />
                                                add reminder
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Add reminder</DialogTitle>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }
                }}
            />

        </>
    )
}
