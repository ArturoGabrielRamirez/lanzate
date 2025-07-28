"use client"

import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type CheckboxFieldProps = {
    name: string
    label: string
}

function CheckboxField({ name, label }: CheckboxFieldProps) {
    const { register, watch, setValue, formState: { errors } } = useFormContext()
    const value = watch(name)
    const error = errors[name]?.message as string | undefined

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id={name}
                    checked={value || false}
                    onCheckedChange={(checked) => setValue(name, checked)}
                    {...register(name)}
                />
                <Label htmlFor={name}>{label}</Label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}

export default CheckboxField 