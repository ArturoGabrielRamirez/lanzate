'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type InputFieldProps = {
  name: string
  label: string
  type?: string
  defaultValue?: string
}

const InputField = ({ name, label, type = 'text', defaultValue }: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} {...register(name)} defaultValue={defaultValue} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default InputField