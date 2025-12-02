"use client"

import { useFormContext, Controller } from "react-hook-form"

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field"
import { Switch } from "@/features/shadcn/components/ui/switch"
import { cn } from "@/lib/utils"

interface SwitchFieldProps {
    name: string
    label: string
    description?: string | React.ReactNode
    defaultValue?: boolean
    disabled?: boolean
    onChange?: (checked: boolean) => void
    className?: string
}

function SwitchField({
    name,
    label,
    description,
    defaultValue,
    disabled = false,
    onChange,
    className,
}: SwitchFieldProps) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field, fieldState }) => {
                const handleCheckedChange = (checked: boolean) => {
                    field.onChange(checked)
                    if (onChange) {
                        onChange(checked)
                    }
                }

                return (
                    <Field orientation="horizontal" className={cn("!items-center gap-2", className)} data-invalid={fieldState.invalid}>
                        <FieldContent className="gap-0">
                            <FieldLabel htmlFor={name}>
                                {label}
                            </FieldLabel>
                            {description && (
                                <FieldDescription className="text-xs">
                                    {description}
                                </FieldDescription>
                            )}
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </FieldContent>
                        <Switch
                            checked={field.value}
                            onCheckedChange={handleCheckedChange}
                            disabled={disabled}
                            id={name}
                        />
                    </Field>
                )
            }}
        />
    )
}

export { SwitchField }

