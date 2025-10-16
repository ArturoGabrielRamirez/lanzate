"use client"

import { EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/features/shadcn/components/input-group";

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
}: {
    name: string,
    label: string,
    placeholder: string,
    startIcon?: React.ReactNode,
    startText?: string,
    endIcon?: React.ReactNode,
    endText?: string,
    description?: string | React.ReactNode,
    type?: string,
    tooltip?: string | React.ReactNode
    isRequired?: boolean
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
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{label}{isRequired && <span className="text-red-500">*</span>}</FieldLabel>
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
                            placeholder={placeholder} {...field}
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                            id={field.name}
                            type={showPassword ? "text" : type}
                            className=""
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
            )}
        />
    )
}

export { InputField };