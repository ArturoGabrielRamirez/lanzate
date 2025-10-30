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
    disabled = false,
    startIcon
}: SelectFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                console.log("🚀 ~ SelectField ~ field:", field)
                return <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        {label}{isRequired && <span className="text-red-500">*</span>}
                    </FieldLabel>
                    <InputGroup className="bg-background focus:!ring-primary focus-within:!ring-primary focus-visible:!ring-primary">
                        {startIcon && (
                            <InputGroupAddon>
                                {startIcon}
                            </InputGroupAddon>
                        )}
                        <Select
                            value={field.value || ''}
                            onValueChange={field.onChange}
                            disabled={disabled}
                            data-slot="input-group-control"
                        >
                            <SelectTrigger
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                className="w-full h-10 px-3 !bg-transparent !outline-none !border-none !ring-0"
                                ref={field.ref}
                                onBlur={field.onBlur}
                                disabled={disabled}
                            >
                                <SelectValue placeholder={placeholder || `Seleccione ${label.toLowerCase()}`} >
                                    {field.value || placeholder || `Seleccione ${label.toLowerCase()}`}
                                </SelectValue>
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
                </Field>;
            }}
        />
    )
}