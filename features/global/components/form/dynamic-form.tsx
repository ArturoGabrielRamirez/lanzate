'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FormInput } from './form-input';
import { FormButton } from './form-button';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export interface FormField {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  validation?: Yup.AnySchema;
  required?: boolean;
  tooltip?: string;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: any) => void | Promise<void>;
  submitText: string;
  submitLoadingText?: string;
  submitLeftIcon?: React.ReactNode;
  validationSchema?: Yup.ObjectSchema<any>;
  defaultValues?: Record<string, any>;
}

export const DynamicForm = ({
  fields,
  onSubmit,
  submitText,
  submitLoadingText,
  submitLeftIcon,
  validationSchema,
  defaultValues = {},
}: DynamicFormProps) => {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const methods = useForm({
    mode: 'onChange', // Validate on each change for real-time button state
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const renderField = (field: FormField) => {
    const isPasswordField = field.type === 'password';
    const fieldType = isPasswordField && showPassword[field.name] ? 'text' : field.type;

    const rightIcon = isPasswordField ? (
      <button
        type="button"
        onClick={() => togglePasswordVisibility(field.name)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {showPassword[field.name] ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    ) : field.rightIcon;

    return (
      <FormInput
        key={field.name}
        label={field.label}
        type={fieldType}
        placeholder={field.placeholder}
        leftIcon={field.leftIcon}
        rightIcon={rightIcon}
        error={errors[field.name]?.message as string}
        isRequired={field.required}
        tooltip={field.tooltip}
        fieldName={field.name}
        {...register(field.name)}
      />
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(renderField)}
        
        <FormButton 
          className="w-full"
          leftIcon={submitLeftIcon}
          loadingText={submitLoadingText}
        >
          {submitText}
        </FormButton>
      </form>
    </FormProvider>
  );
};

