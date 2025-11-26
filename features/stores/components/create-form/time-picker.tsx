"use client"

import { ClockIcon, InfoIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/features/shadcn/components/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/features/shadcn/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
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
    const { control } = useFormContext()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const [hours, minutes] = (field.value || "09:00").split(":")

                const handleTimeChange = (newHours: string, newMinutes: string) => {
                    const newValue = `${newHours}:${newMinutes}`
                    field.onChange(newValue)
                    if (onChange) {
                        // Create a synthetic event to match the expected signature
                        const syntheticEvent = {
                            target: { value: newValue },
                        } as React.ChangeEvent<HTMLInputElement>
                        onChange(syntheticEvent)
                    }
                }

                return (
                    <Field data-invalid={fieldState.invalid}>
                        {!hideLabel && (
                            <FieldLabel htmlFor={field.name}>
                                {label}{isRequired && <span className="text-red-500">*</span>}
                            </FieldLabel>
                        )}
                        <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
                            <PopoverTrigger asChild>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setIsOpen(true)}
                                >
                                    <InputGroup className={cn("bg-background pointer-events-none", isOpen && "ring-2 ring-primary ring-offset-2")}>
                                        <InputGroupAddon>
                                            {startIcon || <ClockIcon />}
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            readOnly
                                            placeholder={placeholder}
                                            value={field.value || ''}
                                            aria-invalid={fieldState.invalid}
                                            id={field.name}
                                            className="cursor-pointer pointer-events-none"
                                            tabIndex={-1}
                                        />
                                        {tooltip && (
                                            <InputGroupAddon align="inline-end" className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <InputGroupButton
                                                            variant="ghost"
                                                            aria-label="Info"
                                                            size="icon-xs"
                                                        >
                                                            <InfoIcon />
                                                        </InputGroupButton>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{tooltip}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </InputGroupAddon>
                                        )}
                                    </InputGroup>
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
                        {description && (
                            <FieldDescription>
                                {description}
                            </FieldDescription>
                        )}
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )
            }}
        />
    )
}