"use client"
import { InfoIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

import { SelectFieldProps } from "@/features/global/types";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/features/shadcn/components/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

export function SelectField({
    name,
    label,
    options,
    placeholder,
    description,
    tooltip,
    isRequired = false,
    disabled = false
}: SelectFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        {label}{isRequired && <span className="text-red-500">*</span>}
                    </FieldLabel>
                    <InputGroup>
                        <div className="relative flex-1">
                            <Select
                                value={field.value || ''}
                                onValueChange={field.onChange}
                                disabled={disabled}
                            >
                                <SelectTrigger
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    className="w-full h-10 px-3 bg-transparent border-2 border-zinc-700 rounded-lg text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e56c43]/30 focus-visible:border-[#e56c43] hover:border-[#e56c43]/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-[#e56c43] data-[state=open]:ring-4 data-[state=open]:ring-[#e56c43]/30"
                                    style={{
                                        boxShadow: fieldState.invalid ? '0 0 0 2px rgba(229, 108, 67, 0.3)' : undefined
                                    }}
                                >
                                    <SelectValue placeholder={placeholder || `Seleccione ${label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    {options.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="cursor-pointer hover:bg-[#e56c43]/10 focus:bg-[#e56c43]/20 text-white"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {tooltip && (
                            <InputGroupAddon align="inline-end">
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
                    {description && (
                        <FieldDescription>
                            {description}
                        </FieldDescription>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    )
}