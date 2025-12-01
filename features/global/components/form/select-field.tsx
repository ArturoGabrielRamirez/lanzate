"use client"
import { InfoIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

import { SelectFieldProps } from "@/features/global/types";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/features/shadcn/components/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils";

export function SelectField({
    name,
    label,
    options,
    placeholder,
    description,
    tooltip,
    isRequired = false,
    disabled = false,
    startIcon,
    onChange,
    hideLabel = false,
    className,
    value: controlledValue, // Allow controlled value from outside
}: SelectFieldProps & { hideLabel?: boolean, className?: string, value?: string }) {
    const { control } = useFormContext();

    // If name is provided, use Controller (React Hook Form)
    if (name) {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => {
                    // If controlledValue is provided, prefer it over field.value (though usually one or the other)
                    // But since we are inside Controller, field.value is the source of truth for RHF.
                    // controlledValue might be used if we want to override RHF state, but that's rare.

                    return <Field data-invalid={fieldState.invalid} className={className}>
                        {!hideLabel && (
                            <FieldLabel htmlFor={field.name}>
                                {label}{isRequired && <span className="text-red-500">*</span>}
                            </FieldLabel>
                        )}
                        <InputGroup className={cn("bg-background focus:!ring-primary focus-within:!ring-primary focus-visible:!ring-primary", disabled && "bg-background/50 cursor-not-allowed")}>
                            {startIcon && (
                                <InputGroupAddon>
                                    {startIcon}
                                </InputGroupAddon>
                            )}
                            <Select
                                value={field.value || ''}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    if (onChange) {
                                        onChange(value);
                                    }
                                }}
                                disabled={disabled}
                            >
                                <SelectTrigger
                                    size="sm"
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    className="w-full h-10 px-3 !bg-transparent !outline-none !border-none !ring-0 shadow-none focus:ring-0"
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    disabled={disabled}
                                >
                                    <SelectValue placeholder={placeholder || `Seleccione ${label.toLowerCase()}`} >
                                        {options.find(o => o.value === field.value)?.label || field.value || placeholder || `Seleccione ${label.toLowerCase()}`}
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

    // If no name, it's a controlled component without React Hook Form context
    return (
        <Field className={className}>
            {!hideLabel && (
                <FieldLabel>
                    {label}{isRequired && <span className="text-red-500">*</span>}
                </FieldLabel>
            )}
            <InputGroup className={cn("bg-background focus:!ring-primary focus-within:!ring-primary focus-visible:!ring-primary", disabled && "bg-background/50 cursor-not-allowed")}>
                {startIcon && (
                    <InputGroupAddon>
                        {startIcon}
                    </InputGroupAddon>
                )}
                <Select
                    value={controlledValue || ''}
                    onValueChange={(value) => {
                        if (onChange) {
                            onChange(value);
                        }
                    }}
                    disabled={disabled}
                >
                    <SelectTrigger
                        className="w-full h-10 px-3 !bg-transparent !outline-none !border-none !ring-0 shadow-none focus:ring-0"
                        disabled={disabled}
                    >
                        <SelectValue placeholder={placeholder || `Seleccione ${label.toLowerCase()}`} >
                            {options.find(o => o.value === controlledValue)?.label || controlledValue || placeholder || `Seleccione ${label.toLowerCase()}`}
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
        </Field>
    )
}