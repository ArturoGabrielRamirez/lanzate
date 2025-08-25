"use client"

import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface CheckboxFieldProps {
  name: string
  label: string
  defaultValue?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  containerClassName?: string
  disabled?: boolean
}

const CheckboxField = ({
  name,
  label,
  defaultValue,
  onChange,
  className,
  containerClassName,
  disabled = false,
}: CheckboxFieldProps) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  const error = errors[name]?.message as string | undefined
  const currentValue = watch(name)

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(name, defaultValue)
    }
  }, [defaultValue, name, setValue])

  const handleChange = (checked: boolean) => {
    setValue(name, checked)
    if (onChange) {
      onChange(checked)
    }
  }

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          checked={currentValue}
          onCheckedChange={handleChange}
          disabled={disabled}
          className={className}
          {...register(name)}
          defaultChecked={defaultValue || false}
        />
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default CheckboxField
