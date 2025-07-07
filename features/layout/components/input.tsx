'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type InputFieldProps = {
  name: 'email' | 'password' | 'username' | 'name' | 'confirmPassword' | 'newPassword' 
  label: string
  type?: string
}

const InputField = ({ name, label, type = 'text' }: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} {...register(name)} />
      {errors[name] && (
        <p className="text-sm text-red-500">{(errors as any)[name]?.message}</p>
      )}
    </div>
  )
}

export default InputField
