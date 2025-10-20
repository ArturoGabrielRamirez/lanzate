"use client"

import { useFormContext } from "react-hook-form"

import { Label } from "@/features/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"

type SelectFieldProps = {
    name: string
    label: string
    options: { value: string, label: string }[]
}

function SelectField({ name, label, options }: SelectFieldProps) {
    const { setValue, watch, formState: { errors } } = useFormContext()
    const value = watch(name)
    const error = errors[name]?.message as string | undefined

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Select value={value || ''} onValueChange={(value) => setValue(name, value)}>
                <SelectTrigger>
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}

export default SelectField 