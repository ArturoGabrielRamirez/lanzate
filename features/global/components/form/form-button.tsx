'use client';

import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { FormButtonProps } from '../../types';

export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  (
    {
      children,
      leftIcon,
      iconOnly = false,
      loadingText,
      variant = 'default',
      size = 'lg',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Try to get form context if available
    let formContext;
    try {
      formContext = useFormContext();
    } catch {
      // No form context available, that's ok
      formContext = null;
    }

    const isSubmitting = formContext?.formState?.isSubmitting ?? false;
    const isValid = formContext?.formState?.isValid ?? true;
    const hasErrors = !!(formContext?.formState?.errors && Object.keys(formContext.formState.errors).length > 0);

    // Button should be disabled if:
    // 1. Explicitly disabled prop
    // 2. Form is submitting
    // 3. Form has errors
    // 4. Form is not valid (when in form context)
    const isDisabled = disabled || isSubmitting || (formContext && (hasErrors || !isValid));

    const renderContent = () => {
      // If submitting, show spinner
      if (isSubmitting) {
        if (iconOnly) {
          return <Spinner size="sm" />;
        }

        return (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            {loadingText && <span>{loadingText}</span>}
          </div>
        );
      }

      // Icon only mode
      if (iconOnly && leftIcon) {
        return leftIcon;
      }

      // Normal mode with optional left icon
      if (leftIcon && children) {
        return (
          <div className="flex items-center gap-2">
            {leftIcon}
            <span>{children}</span>
          </div>
        );
      }

      return children;
    };

    return (
      <Button
        ref={ref}
        type="submit"
        variant={variant}
        size={iconOnly ? 'icon' : size}
        disabled={isDisabled ?? false}
        className={cn(className)}
        {...props}
      >
        {renderContent()}
      </Button>
    );
  }
);

FormButton.displayName = 'FormButton';

