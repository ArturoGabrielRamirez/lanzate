"use client"

import { InfoIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/features/shadcn/components/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"

function TextareaField({
  name,
  label,
  placeholder,
  startIcon,
  startText,
  endIcon,
  endText,
  description,
  tooltip,
  isRequired = false,
  disabled = false,
  defaultValue,
  hideLabel = false,
  onChange,
  className,
  maxLength,
}: {
  name: string,
  label: string,
  placeholder: string,
  startIcon?: React.ReactNode,
  startText?: string,
  endIcon?: React.ReactNode,
  endText?: string,
  description?: string | React.ReactNode,
  tooltip?: string | React.ReactNode
  isRequired?: boolean
  disabled?: boolean
  defaultValue?: string
  hideLabel?: boolean
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  maxLength?: number
}) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            <InputGroup className={cn("bg-background", disabled && "bg-background/50 cursor-not-allowed", className)}>
              {startIcon && (
                <InputGroupAddon>
                  {startIcon}
                </InputGroupAddon>
              )}
              {startText && (
                <InputGroupText className="pl-2">
                  {startText}
                </InputGroupText>
              )}
              <InputGroupTextarea
                placeholder={placeholder}
                value={field.value || ''}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                id={field.name}
                name={field.name}
                onBlur={field.onBlur}
                ref={field.ref}
                className={cn("")}
                defaultValue={defaultValue}
                disabled={disabled}
                maxLength={maxLength}
                onChange={handleChange}
              />
              {endText && (
                <InputGroupText className="pr-2">
                  {endText}
                </InputGroupText>
              )}
              {endIcon && (
                <InputGroupAddon align="block-end">
                  {endIcon}
                </InputGroupAddon>
              )}
              {tooltip && (
                <InputGroupAddon align="block-end">
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

export { TextareaField };