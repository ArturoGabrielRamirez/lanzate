"use client"

import { EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react"
import { useState } from "react"
import { useFormContext, Controller } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/features/shadcn/components/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

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
    inputMode = "text",
    onChange,
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
    inputMode?: "text" | "email" | "search" | "tel" | "url" | "none" | "decimal" | "numeric" | undefined
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
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
                // Función que combina el onChange de react-hook-form con el onChange custom
                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    // Primero ejecuta el onChange de react-hook-form (crítico para la validación)
                    field.onChange(e);
                    
                    // Luego ejecuta el onChange custom si fue proporcionado
                    if (onChange) {
                        onChange(e);
                    }
                }

                return (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            {label}{isRequired && <span className="text-red-500">*</span>}
                        </FieldLabel>
                        <InputGroup>
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
                                className=""
                                defaultValue={defaultValue}
                                disabled={disabled}
                                inputMode={inputMode}
                                onChange={handleChange}
                            />
                            {endText && (
                                <InputGroupText>
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