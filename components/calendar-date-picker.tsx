"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/features/shadcn/components/ui/button"
import { Calendar } from "@/features/shadcn/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/features/shadcn/components/ui/popover"

interface CalendarDatePickerProps {
    date: {
        from: Date | undefined
        to: Date | undefined
    }
    onDateSelect: (range: { from: Date; to: Date }) => void
    className?: string
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

export function CalendarDatePicker({
    date,
    onDateSelect,
    className,
    variant = "outline",
}: CalendarDatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
        if (range?.from && range?.to) {
            onDateSelect({ from: range.from, to: range.to })
        } else if (range?.from) {
            // Allow selecting same day as from and to
            onDateSelect({ from: range.from, to: range.from })
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={variant}
                    className={cn(
                        "justify-start text-left font-normal",
                        !date.from && !date.to && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date.from ? (
                        date.to ? (
                            <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Pick a date range</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={date.from}
                    selected={{ from: date.from, to: date.to }}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                />
                <div className="flex items-center justify-end gap-2 p-3 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onDateSelect({ from: new Date(), to: new Date() })
                        }}
                    >
                        Today
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const today = new Date()
                            const weekAgo = new Date(today)
                            weekAgo.setDate(today.getDate() - 7)
                            onDateSelect({ from: weekAgo, to: today })
                        }}
                    >
                        Last 7 days
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const today = new Date()
                            const monthAgo = new Date(today)
                            monthAgo.setMonth(today.getMonth() - 1)
                            onDateSelect({ from: monthAgo, to: today })
                        }}
                    >
                        Last 30 days
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

