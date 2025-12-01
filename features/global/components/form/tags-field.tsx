"use client"

import { CheckIcon, InfoIcon } from "lucide-react"
import { useState } from "react"
import { Controller, FieldError as FieldErrorType, useFormContext } from "react-hook-form"

import {
    Tags,
    TagsContent,
    TagsEmpty,
    TagsGroup,
    TagsInput,
    TagsItem,
    TagsList,
    TagsValue
} from "@/components/ui/shadcn-io/tags"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field"
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/features/shadcn/components/input-group"
import { PopoverTrigger } from "@/features/shadcn/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface TagOption {
    value: string
    label: string
}

interface TagsFieldProps {
    name?: string
    value?: string[]
    onChange?: (value: string[]) => void
    label: string
    placeholder?: string
    startIcon?: React.ReactNode
    startText?: string
    endIcon?: React.ReactNode
    description?: string | React.ReactNode
    tooltip?: string | React.ReactNode
    isRequired?: boolean
    disabled?: boolean
    options?: TagOption[]
    maxTags?: number
    onCreate?: (tag: string) => void
    className?: string
}

function TagsField({
    name,
    label,
    placeholder,
    startIcon,
    startText,
    endIcon,
    description,
    tooltip,
    isRequired = false,
    disabled = false,
    options = [], // Predefined options
    maxTags,
    onChange,
    onCreate,
    value: controlledValue,
    className,
}: TagsFieldProps) {

    const { control } = useFormContext()
    const [inputValue, setInputValue] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const renderTagsInput = (
        value: string[],
        onChangeInternal: (val: string[]) => void,
        fieldState: { invalid: boolean; error?: FieldErrorType }
    ) => {
        const handleSelect = (selectedValue: string) => {
            let newValue = [...value]
            if (newValue.includes(selectedValue)) {
                newValue = newValue.filter(v => v !== selectedValue)
            } else {
                if (maxTags && newValue.length >= maxTags) return
                newValue.push(selectedValue)

                // Check if it is a new creation (not in predefined options)
                const isPredefined = options.some(o => o.value === selectedValue)
                if (!isPredefined && onCreate) {
                    onCreate(selectedValue)
                }
            }
            onChangeInternal(newValue)
            if (onChange && name) onChange(newValue) // If controlled via name, call extra onChange
            setInputValue("") // Clear input after selection
        }

        const handleRemove = (tagToRemove: string) => {
            const newValue = value.filter(t => t !== tagToRemove)
            onChangeInternal(newValue)
            if (onChange && name) onChange(newValue)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault()
                const newTag = inputValue.trim()
                // Allow creating new tag if it's not in current value
                if (!value.includes(newTag)) {
                    handleSelect(newTag)
                } else {
                    setInputValue("")
                }
            }
        }

        return (
            <Field data-invalid={fieldState.invalid}>
                {label && (
                    <FieldLabel htmlFor={name || "tags-input"}>
                        {label}{isRequired && <span className="text-red-500">*</span>}
                    </FieldLabel>
                )}

                <Tags
                    value={inputValue}
                    open={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <PopoverTrigger asChild>
                        <div
                            className="w-full"
                            onClick={() => !disabled && setIsOpen(true)}
                        >
                            <InputGroup className={cn("bg-background h-auto min-h-10 flex-wrap", disabled && "bg-background/50 cursor-not-allowed", className)}>
                                {startIcon && (
                                    <InputGroupAddon>
                                        {startIcon}
                                    </InputGroupAddon>
                                )}
                                {startText && (
                                    <InputGroupAddon className="pl-2">
                                        <span className="text-sm text-muted-foreground">{startText}</span>
                                    </InputGroupAddon>
                                )}

                                <div
                                    data-slot="input-group-control"
                                    className={cn(
                                        "flex-1 flex flex-wrap items-center gap-1.5 p-2 min-w-0 bg-transparent border-0 outline-none",
                                        disabled && "cursor-not-allowed opacity-50"
                                    )}
                                    tabIndex={disabled ? -1 : 0}
                                >
                                    {value.length > 0 ? (
                                        value.map((tag) => (
                                            <TagsValue key={tag} onRemove={disabled ? undefined : () => handleRemove(tag)}>
                                                {options.find(o => o.value === tag)?.label || tag}
                                            </TagsValue>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground text-sm px-1">{placeholder || "Seleccionar..."}</span>
                                    )}
                                </div>

                                {endIcon && (
                                    <InputGroupAddon align="inline-end">
                                        {endIcon}
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
                                                    onClick={(e) => e.stopPropagation()} // Prevent opening popover
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

                    <TagsContent className="w-full min-w-[200px]">
                        <TagsInput
                            placeholder="Buscar o crear etiqueta..."
                            value={inputValue}
                            onValueChange={setInputValue}
                            onKeyDown={handleKeyDown}
                        />
                        <TagsList>
                            <TagsEmpty className="text-xs p-2 text-muted-foreground">
                                {inputValue ? "Presiona Enter para crear." : "No hay etiquetas encontradas."}
                            </TagsEmpty>

                            {options.length > 0 && (
                                <TagsGroup heading="Sugerencias">
                                    {options.map((option) => (
                                        <TagsItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={() => {
                                                handleSelect(option.value)
                                            }}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span>{option.label}</span>
                                                {value.includes(option.value) && (
                                                    <CheckIcon className="h-4 w-4" />
                                                )}
                                            </div>
                                        </TagsItem>
                                    ))}
                                </TagsGroup>
                            )}

                            {/* If we want to show the "Create" option explicitly when typing */}
                            {inputValue && !options.find(o => o.value === inputValue) && !value.includes(inputValue) && (
                                <TagsGroup>
                                    <TagsItem
                                        value={inputValue}
                                        onSelect={() => {
                                            handleSelect(inputValue)
                                        }}
                                    >
                                        Crear &quot;{inputValue}&quot;
                                    </TagsItem>
                                </TagsGroup>
                            )}
                        </TagsList>
                    </TagsContent>
                </Tags>

                {description && (
                    <FieldDescription>
                        {description}
                    </FieldDescription>
                )}
                {fieldState.invalid && <FieldError errors={fieldState.error} />}
            </Field>
        )
    }

    if (name) {
        return (
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => {
                     const value: string[] = Array.isArray(field.value) ? field.value : []
                     return renderTagsInput(value, field.onChange, fieldState)
                }}
            />
        )
    } else {
        // Controlled mode
        const value = controlledValue || []
        const handleChange = (newVal: string[]) => {
             if (onChange) onChange(newVal)
        }
        return renderTagsInput(value, handleChange, { invalid: false })
    }
}

export { TagsField }
