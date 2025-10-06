'use client';

import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Field, FieldLabel, FieldMessage } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupText } from '@/components/ui/input-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
  tooltip?: string;
  fieldName?: string; // For detecting errors via useFormContext
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, leftIcon, rightIcon, isRequired, tooltip, fieldName, className, ...props }, ref) => {
    const hasError = !!error;
    
    // Try to get form context if available
    let formContext;
    try {
      formContext = useFormContext();
    } catch {
      // No form context available, that's ok
      formContext = null;
    }

    // Check if there's an error for this field in the form context
    const fieldError = fieldName && formContext?.formState?.errors?.[fieldName];
    const isFieldInvalid = hasError || !!fieldError;

    const renderLabel = () => {
      if (!label) return null;

      return (
        <FieldLabel className={cn(
          'flex items-center gap-2 group-hover:text-foreground group-focus-within:text-foreground',
          isFieldInvalid && 'text-destructive group-hover:text-destructive group-focus-within:text-destructive'
        )}>
          <span>
            {label}
            {isRequired && (
              <span className="text-destructive ml-1" aria-label="required">*</span>
            )}
          </span>
          {tooltip && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger type="button" className="inline-flex cursor-pointer">
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </FieldLabel>
      );
    };

    if (leftIcon || rightIcon) {
      return (
        <Field className="group">
          {renderLabel()}
          <InputGroup className={cn(isFieldInvalid && 'border-destructive')}>
            {leftIcon && <InputGroupText>{leftIcon}</InputGroupText>}
            <Input
              ref={ref}
              className={cn(
                'border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                className
              )}
              {...props}
            />
            {rightIcon && <InputGroupText>{rightIcon}</InputGroupText>}
          </InputGroup>
          {error && <FieldMessage>{error}</FieldMessage>}
        </Field>
      );
    }

    return (
      <Field className="group">
        {renderLabel()}
        <Input
          ref={ref}
          className={cn(isFieldInvalid && 'border-destructive', className)}
          {...props}
        />
        {error && <FieldMessage>{error}</FieldMessage>}
      </Field>
    );
  }
);

FormInput.displayName = 'FormInput';

