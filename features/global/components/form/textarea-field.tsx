"use client"

import { InfoIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/features/shadcn/components/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@/features/shadcn/components/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

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
}) {

  const { control } = useFormContext();

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
            <InputGroupTextarea
              placeholder={placeholder} {...field}
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              id={field.name}
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

export { TextareaField };