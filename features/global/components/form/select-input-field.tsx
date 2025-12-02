"use client"

import { InfoIcon } from "lucide-react"
import { useFormContext, Controller, FieldError as FieldErrorType } from "react-hook-form"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/features/shadcn/components/input-group"
import { ButtonGroup } from "@/features/shadcn/components/ui/button-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface SelectOption {
    value: string
    label: string | React.ReactNode
    description?: string | React.ReactNode
}

interface SelectInputFieldProps {
    name?: string
    selectName?: string
    inputName?: string
    label: string
    selectOptions: SelectOption[]
    selectPlaceholder?: string
    inputPlaceholder?: string
    selectValue?: string
    inputValue?: string
    onSelectChange?: (value: string) => void
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    description?: string | React.ReactNode
    tooltip?: string | React.ReactNode
    isRequired?: boolean
    startIcon?: React.ReactNode
    disabled?: boolean
    hideLabel?: boolean
    className?: string
    endButton?: {
        icon: React.ReactNode
        onClick: () => void
        ariaLabel: string
    }
    inputType?: string
    inputMode?: "text" | "email" | "search" | "tel" | "url" | "none" | "decimal" | "numeric" | undefined
    inputPattern?: string
}

function SelectInputField({
    name,
    selectName,
    inputName,
    label,
    selectOptions,
    selectPlaceholder,
    inputPlaceholder,
    selectValue: controlledSelectValue,
    inputValue: controlledInputValue,
    onSelectChange,
    onInputChange,
    description,
    tooltip,
    isRequired = false,
    disabled = false,
    startIcon,
    hideLabel = false,
    className,
    endButton,
    inputType = "text",
    inputMode = "text",
    inputPattern,
}: SelectInputFieldProps) {
    // Use form context - component assumes FormProvider is available when using React Hook Form
    // If no names are provided, component works in controlled mode without using the control
    const { control } = useFormContext()

    const renderSelectInput = (
        selectValue: string,
        inputValue: string,
        onSelectChangeInternal: (val: string) => void,
        onInputChangeInternal: (e: React.ChangeEvent<HTMLInputElement>) => void,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fieldState: { invalid: boolean; error?: FieldErrorType | Array<{ message?: string } | undefined> | any }
    ) => {
        // Use first option as default if selectValue is empty
        const finalSelectValue = selectValue || selectOptions[0]?.value || ""
        return (
            <Field data-invalid={fieldState.invalid} className={className}>
                {!hideLabel && (
                    <FieldLabel>
                        {label}{isRequired && <span className="text-red-500">*</span>}
                    </FieldLabel>
                )}
                <ButtonGroup className={cn("bg-background w-full", disabled && "bg-background/50 cursor-not-allowed")}>
                    <ButtonGroup>
                        <Select
                            value={finalSelectValue}
                            onValueChange={(value) => {
                                onSelectChangeInternal(value)
                                if (onSelectChange) {
                                    onSelectChange(value)
                                }
                            }}
                            disabled={disabled}
                        >
                            <SelectTrigger className="font-mono min-w-fit !h-full !grow" onClick={e=>e.stopPropagation()}>
                                <SelectValue placeholder={selectPlaceholder || "Seleccionar"} />
                            </SelectTrigger>
                            <SelectContent className="min-w-24" onClick={e=>e.stopPropagation()}>
                                {selectOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                        {option.description && (
                                            <span className="text-muted-foreground ml-2">
                                                {option.description}
                                            </span>
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputGroup>
                        {startIcon && (
                                <InputGroupAddon>
                                    {startIcon}
                                </InputGroupAddon>
                            )}
                            <InputGroupInput
                                placeholder={inputPlaceholder || ""}
                                value={inputValue || ""}
                                type={inputType}
                                inputMode={inputMode}
                                pattern={inputPattern}
                                disabled={disabled}
                                onChange={onInputChangeInternal}
                                className="flex-1"
                                aria-invalid={fieldState.invalid}
                            />
                            {endButton && (
                                <InputGroupAddon
                                    align="inline-end"
                                    aria-label={endButton.ariaLabel}
                                    onClick={endButton.onClick}
                                >
                                    {endButton.icon}
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
                                                disabled={disabled}
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
                    </ButtonGroup>
                </ButtonGroup>
                {description && (
                    <FieldDescription>
                        {description}
                    </FieldDescription>
                )}
                {fieldState.invalid && <FieldError errors={Array.isArray(fieldState.error) ? fieldState.error : fieldState.error ? [fieldState.error] : undefined} />}
            </Field>
        )
    }

    // If both selectName and inputName are provided, use Controller for both
    if (selectName && inputName && control) {
        const defaultSelectValue = selectOptions[0]?.value || ""
        
        return (
            <>
                <Controller
                    name={selectName}
                    control={control}
                    defaultValue={controlledSelectValue || defaultSelectValue}
                    render={({ field: selectField, fieldState: selectFieldState }) => (
                        <Controller
                            name={inputName}
                            control={control}
                            defaultValue={controlledInputValue || ""}
                            render={({ field: inputField, fieldState: inputFieldState }) => {
                                const handleSelectChange = (value: string) => {
                                    selectField.onChange(value)
                                    if (onSelectChange) {
                                        onSelectChange(value)
                                    }
                                }

                                const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                    inputField.onChange(e)
                                    if (onInputChange) {
                                        onInputChange(e)
                                    }
                                }

                                // Combine field states - invalid if either is invalid
                                const errors: Array<{ message?: string } | undefined> = []
                                if (selectFieldState.error) errors.push(selectFieldState.error)
                                if (inputFieldState.error) errors.push(inputFieldState.error)
                                const combinedFieldState = {
                                    invalid: selectFieldState.invalid || inputFieldState.invalid,
                                    error: errors.length > 0 ? errors : undefined,
                                }

                                // Use default value from selectOptions if field value is empty
                                // The useEffect in the parent component should set the default value in the form
                                const defaultSelectValue = selectOptions[0]?.value || ""
                                const selectValue = selectField.value || defaultSelectValue
                                
                                return renderSelectInput(
                                    selectValue,
                                    inputField.value || "",
                                    handleSelectChange,
                                    handleInputChange,
                                    combinedFieldState
                                )
                            }}
                        />
                    )}
                />
            </>
        )
    }

    // If only name is provided, assume it's for the input and select is controlled separately
    if (name && control) {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => {
                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        field.onChange(e)
                        if (onInputChange) {
                            onInputChange(e)
                        }
                    }

                    return renderSelectInput(
                        controlledSelectValue || "",
                        field.value || "",
                        (value) => {
                            if (onSelectChange) {
                                onSelectChange(value)
                            }
                        },
                        handleInputChange,
                        fieldState
                    )
                }}
            />
        )
    }

    // Controlled mode - no React Hook Form
    const handleSelectChange = (value: string) => {
        if (onSelectChange) {
            onSelectChange(value)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onInputChange) {
            onInputChange(e)
        }
    }

    return renderSelectInput(
        controlledSelectValue || "",
        controlledInputValue || "",
        handleSelectChange,
        handleInputChange,
        { invalid: false }
    )
}

export { SelectInputField }

