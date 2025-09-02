'use client'

import { useFormContext, get } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

type InputFieldProps = {
  name: string
  label: string
  type?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
  className?: string
  containerClassName?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  placeholder?: string,
  disabled?: boolean
  isTextArea?: boolean
  isRequired?: boolean
  inputMode?: "search" | "text" | "numeric" | "none" | "tel" | "url" | "email" | "decimal" | undefined
}

const InputField = ({
  name,
  label,
  type = 'text',
  defaultValue,
  onChange,
  value,
  className,
  containerClassName,
  onKeyDown,
  startContent,
  endContent,
  placeholder,
  disabled = false,
  isTextArea = false,
  isRequired = false,
  inputMode = "text",
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext()

  const error = get(errors, name)?.message as string | undefined

  const inputControls: Partial<{
    value: string
    defaultValue: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }> = {}

  const textareaControls: Partial<{
    value: string
    defaultValue: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  }> = {}

  if (!defaultValue && value) {
    inputControls.value = value || ""
    textareaControls.value = value || ""
  } else {
    inputControls.defaultValue = defaultValue
    textareaControls.defaultValue = defaultValue
  }
  if (onChange) {
    inputControls.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(name, e.target.value)
      onChange(e)
    }
    textareaControls.onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(name, e.target.value)
      // Cast to satisfy consumer signature if they passed an input onChange
      onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <Label htmlFor={name}>{label}{isRequired && <span className="text-red-500">*</span>}</Label>
      {isTextArea ? (
        <Textarea
          id={name}
          placeholder={placeholder}
          {...register(name)}
          defaultValue={defaultValue}
          className={cn(className, disabled && "opacity-50 bg-muted cursor-not-allowed")}
          onKeyDown={onKeyDown}
          {...textareaControls}
          disabled={disabled}
        />) : (
        <Input
          id={name}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          {...register(name)}
          defaultValue={defaultValue}
          className={cn(className, disabled && "opacity-50 bg-muted cursor-not-allowed")}
          onKeyDown={onKeyDown}
          startContent={startContent}
          endContent={endContent}
          {...inputControls}
          disabled={disabled}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default InputField