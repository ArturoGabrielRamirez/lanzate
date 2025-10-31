"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

/* import { Checkbox } from "@/features/shadcn/components/ui/checkbox" */
import { CheckboxFieldProps } from "@/features/global/types"
import { Label } from "@/features/shadcn/components/ui/label"
import { Switch } from "@/features/shadcn/components/ui/switch"
import { cn } from "@/lib/utils"

function CheckboxField({
  name,
  label,
  defaultValue,
  onChange,
  className,
  containerClassName,
  disabled = false,
}: CheckboxFieldProps) {
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
        <Switch
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
