"use client";

import { EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext, Controller, useForm } from "react-hook-form";

import { InputFieldProps } from "@/features/global/types/form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/features/shadcn/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/features/shadcn/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shadcn/components/ui/tooltip";
import { cn } from "@/features/shadcn/utils/cn";

/**
 * Global reusable InputField component
 *
 * A comprehensive input component that integrates React Hook Form, shadcn Field and InputGroup,
 * with support for icons, tooltips, password visibility toggle, and inline validation errors.
 *
 * Features:
 * - Integrates with React Hook Form via Controller
 * - Password visibility toggle for password fields
 * - Icons and text addons (start/end)
 * - Tooltip support
 * - Inline validation error display
 * - Required field indicators
 * - Customizable styling
 *
 * @example
 * ```tsx
 * <InputField
 *   name="email"
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   type="email"
 *   isRequired
 *   startIcon={<MailIcon />}
 * />
 * ```
 */
export function InputField({
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
  onChange,
  hideLabel = false,
  className,
  maxLength,
  autoFocus = false,
}: InputFieldProps) {
  const context = useFormContext();
  const control = context?.control || undefined;
  const backupControl = useForm().control;
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      name={name}
      control={control || backupControl}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(e);
          if (onChange) {
            onChange(e);
          }
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            {!hideLabel && (
              <FieldLabel htmlFor={field.name}>
                {label}
                {isRequired && <span className="text-red-500">*</span>}
              </FieldLabel>
            )}
            <InputGroup
              className={cn(
                "bg-background",
                disabled && "bg-background/50 cursor-not-allowed",
                className
              )}
            >
              {startIcon && <InputGroupAddon>{startIcon}</InputGroupAddon>}
              {startText && (
                <InputGroupText className="pl-2">{startText}</InputGroupText>
              )}
              <InputGroupInput
                placeholder={placeholder}
                value={field.value || ""}
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
                maxLength={maxLength}
                onChange={handleChange}
                tabIndex={readOnly ? -1 : 0}
                autoFocus={autoFocus}
              />
              {endText && (
                <InputGroupText className="pr-2">{endText}</InputGroupText>
              )}
              {endIcon && (
                <InputGroupAddon align="inline-end">{endIcon}</InputGroupAddon>
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
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
