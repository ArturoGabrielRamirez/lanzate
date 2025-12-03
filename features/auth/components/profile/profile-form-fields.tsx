import { useFormContext } from "react-hook-form"

import { ProfileFormData } from "@/features/auth/schemas/profile-schema"
import { Input } from "@/features/shadcn/components/ui/input"
import { Label } from "@/features/shadcn/components/ui/label"

export function ProfileFormFields({ currentEmail }: { currentEmail: string }) {
    const { register, formState: { errors } } = useFormContext<ProfileFormData>();

    const getFieldError = (field: keyof ProfileFormData) => ({
        error: errors[field]?.message as string | undefined,
        isInvalid: !!errors[field],
    });

    return (
        <div className="space-y-4">
            {/* Email (Solo lectura) */}
            <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                    id="email"
                    value={currentEmail}
                    disabled
                    readOnly
                    className="bg-muted/30"
                />
                <p className="text-xs text-muted-foreground">
                    Contacta a soporte para cambiar el email o usa el botón de cambio de email.
                </p>
            </div>

            {/* Username */}
            <div className="space-y-2">
                <Label htmlFor="username">
                    Nombre de usuario
                    <span className="text-xs text-muted-foreground ml-2">(requerido)</span>
                </Label>
                <Input
                    id="username"
                    placeholder="ej: juan_perez"
                    className={getFieldError('username').isInvalid ? 'border-red-500' : ''}
                    {...register('username')}
                    autoFocus
                />
                {getFieldError('username').error && (
                    <p className="text-xs text-red-500">{getFieldError('username').error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Solo letras, números y . _ - permitidos.
                </p>
            </div>

            {/* First Name */}
            <div className="space-y-2">
                <Label htmlFor="firstName">
                    Nombre
                    <span className="text-xs text-muted-foreground ml-2">(opcional)</span>
                </Label>
                <Input
                    id="firstName"
                    placeholder="ej: Juan"
                    className={getFieldError('firstName').isInvalid ? 'border-red-500' : ''}
                    {...register('firstName')}
                />
                {getFieldError('firstName').error && (
                    <p className="text-xs text-red-500">{getFieldError('firstName').error}</p>
                )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
                <Label htmlFor="lastName">
                    Apellido
                    <span className="text-xs text-muted-foreground ml-2">(opcional)</span>
                </Label>
                <Input
                    id="lastName"
                    placeholder="ej: Pérez"
                    className={getFieldError('lastName').isInvalid ? 'border-red-500' : ''}
                    {...register('lastName')}
                />
                {getFieldError('lastName').error && (
                    <p className="text-xs text-red-500">{getFieldError('lastName').error}</p>
                )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <Label htmlFor="phone">
                    Teléfono
                    <span className="text-xs text-muted-foreground ml-2">(opcional)</span>
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="ej: +54 11 1234-5678"
                    className={getFieldError('phone').isInvalid ? 'border-red-500' : ''}
                    {...register('phone')}
                />
                {getFieldError('phone').error && (
                    <p className="text-xs text-red-500">{getFieldError('phone').error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Formato: código de país + número (8-15 dígitos)
                </p>
            </div>
        </div>
    )
}
