"use client"

import { EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react"
import { useState } from "react"
import { useFormContext, Controller } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/features/shadcn/components/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"

function InputField({
    name,
    label,
    placeholder,
    startIcon,
    startText,
    endIcon,
    endText,
    description,
    type = "text",
    tooltip,
    isRequired = false,
    defaultValue,
    disabled = false,
    readOnly = false,
    inputMode = "text",
    hideLabel = false,
    onChange,
    className,
}: {
    name: string,
    label: string,
    placeholder: string,
    startIcon?: React.ReactNode,
    startText?: string,
    endIcon?: React.ReactNode,
    endText?: string | React.ReactNode,
    description?: string | React.ReactNode,
    type?: string,
    tooltip?: string | React.ReactNode,
    defaultValue?: string,
    isRequired?: boolean,
    disabled?: boolean,
    readOnly?: boolean,
    inputMode?: "text" | "email" | "search" | "tel" | "url" | "none" | "decimal" | "numeric" | undefined
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    hideLabel?: boolean
    className?: string
}) {

    const { control } = useFormContext();
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    if (onChange) {
                        onChange(e);
                    }
                }

                return (
                    <Field data-invalid={fieldState.invalid}>
                        {!hideLabel && (
                            <FieldLabel htmlFor={field.name}>
                                {label}{isRequired && <span className="text-red-500">*</span>}
                            </FieldLabel>
                        )}
                        <InputGroup className={cn("bg-background", className)}>
                            {startIcon && (
                                <InputGroupAddon>
                                    {startIcon}
                                </InputGroupAddon>
                            )}
                            {startText && (
                                <InputGroupText>
                                    {startText}
                                </InputGroupText>
                            )}
                            <InputGroupInput
                                placeholder={placeholder}
                                value={field.value || ''}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                id={field.name}
                                name={field.name}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                type={showPassword ? "text" : type}
                                className={cn(readOnly && "cursor-pointer focus-visible:ring-0")}
                                defaultValue={defaultValue}
                                disabled={disabled}
                                readOnly={readOnly}
                                inputMode={inputMode}
                                onChange={handleChange}
                                tabIndex={readOnly ? -1 : 0}
                            />
                            {endText && (
                                <InputGroupText className="pr-2">
                                    {endText}
                                </InputGroupText>
                            )}
                            {endIcon && (
                                <InputGroupAddon align="inline-end">
                                    {endIcon}
                                </InputGroupAddon>
                            )}
                            {type === "password" && (
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        variant="ghost"
                                        aria-label="Toggle password visibility"
                                        size="icon-xs"
                                        onClick={handleTogglePasswordVisibility}
                                    >
                                        {!showPassword ? <EyeIcon /> : <EyeOffIcon />}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            )}
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
                )
            }}
        />
    )
}

export { InputField };
