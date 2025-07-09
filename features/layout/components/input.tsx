'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type InputFieldProps = {
  name: string
  label: string
  type?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
  className?: string
}

const InputField = ({ name, label, type = 'text', defaultValue, onChange, value, className }: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} {...register(name)} defaultValue={defaultValue} onChange={onChange} value={value} className={className} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default InputField