'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type InputFieldProps = {
  name: string
  label: string
  type?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
  className?: string
  containerClassName?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  placeholder?: string,
  disabled?: boolean
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
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string | undefined

  const controlls: Record<string, any> = {}

  if (value) controlls.value = value
  if (onChange) controlls.onChange = onChange

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type} 
        placeholder={placeholder}
        {...register(name)}
        defaultValue={defaultValue}
        className={className}
        onKeyDown={onKeyDown}
        startContent={startContent}
        endContent={endContent}
        {...controlls}
        disabled={disabled}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default InputField