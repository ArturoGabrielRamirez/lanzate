'use client'

import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type TextareaFieldProps = {
  name: string
  label: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
  className?: string
  containerClassName?: string
  placeholder?: string
  rows?: number
}

const TextareaField = ({
  name,
  label,
  defaultValue,
  onChange,
  value,
  className,
  containerClassName,
  placeholder,
  rows = 4
}: TextareaFieldProps) => {
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
      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        defaultValue={defaultValue}
        className={className}
        {...controlls}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default TextareaField 