"use client"

import { ClockIcon } from "lucide-react"
import { useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Popover, PopoverContent, PopoverTrigger } from "@/features/shadcn/components/ui/popover"
import { WheelPicker, WheelPickerWrapper } from "@/features/shadcn/components/wheel-picker"
import { cn } from "@/lib/utils"

interface TimePickerProps {
    name: string
    label: string
    placeholder?: string
    description?: string
    tooltip?: string | React.ReactNode
    isRequired?: boolean
    hideLabel?: boolean
    startIcon?: React.ReactNode
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString().padStart(2, "0"),
    label: i.toString().padStart(2, "0"),
}))

const MINUTES = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString().padStart(2, "0"),
    label: i.toString().padStart(2, "0"),
}))

export function TimePicker({
    name,
    label,
    placeholder = "00:00",
    description,
    tooltip,
    isRequired = false,
    hideLabel = false,
    startIcon,
    onChange,
}: TimePickerProps) {
    const { setValue, control } = useFormContext()
    const [isOpen, setIsOpen] = useState(false)
    
    const value = useWatch({
        control,
        name,
        defaultValue: "09:00"
    })

    const [hours, minutes] = (value || "09:00").split(":")

    const handleTimeChange = (newHours: string, newMinutes: string) => {
        const newValue = `${newHours}:${newMinutes}`
        setValue(name, newValue, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        
        if (onChange) {
            // Create a synthetic event to match the expected signature
            const syntheticEvent = {
                target: { value: newValue },
            } as React.ChangeEvent<HTMLInputElement>
            onChange(syntheticEvent)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
            <PopoverTrigger asChild>
                <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                     <InputField
                        name={name}
                        label={label}
                        placeholder={placeholder}
                        description={description}
                        tooltip={tooltip}
                        isRequired={isRequired}
                        hideLabel={hideLabel}
                        startIcon={startIcon || <ClockIcon />}
                        readOnly
                        className={cn(isOpen && "ring-2 ring-primary ring-offset-2")}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <WheelPickerWrapper>
                    <WheelPicker
                        options={HOURS}
                        value={hours || "09"}
                        onValueChange={(val) => handleTimeChange(val as string, minutes || "00")}
                    />
                    <div className="flex items-center justify-center text-xl font-bold pb-1 px-2">:</div>
                    <WheelPicker
                        options={MINUTES}
                        value={minutes || "00"}
                        onValueChange={(val) => handleTimeChange(hours || "09", val as string)}
                    />
                </WheelPickerWrapper>
            </PopoverContent>
        </Popover>
    )
}
