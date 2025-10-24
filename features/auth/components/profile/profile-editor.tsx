'use client'

import { Edit, Loader2, Save } from "lucide-react"
import { useState } from 'react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileEditorProps } from '@/features/auth/types'

export function ProfileEditor({
  currentUsername,
  currentFirstName,
  currentLastName,
  currentPhone,
  onProfileUpdate
}: ProfileEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    username: currentUsername || '',
    firstName: currentFirstName || '',
    lastName: currentLastName || '',
    phone: currentPhone || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar username
    if (formData.username) {
      if (formData.username.length < 3) {
        newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
      } else if (formData.username.length > 30) {
        newErrors.username = 'El nombre de usuario debe tener máximo 30 caracteres'
      } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
        newErrors.username = 'Solo se permiten letras, números, puntos, guiones y guiones bajos'
      }
    }

    // Validar nombres (opcional pero si se proporciona debe ser válido)
    if (formData.firstName && formData.firstName.length > 50) {
      newErrors.firstName = 'El nombre debe tener máximo 50 caracteres'
    }

    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = 'El apellido debe tener máximo 50 caracteres'
    }

    // Validar teléfono (opcional pero si se proporciona debe ser válido)
    if (formData.phone) {
      // Remover espacios, guiones y paréntesis para validar
      const cleanPhone = formData.phone.replace(/[\s\-\(\)\+]/g, '')
      if (!/^\d{8,15}$/.test(cleanPhone)) {
        newErrors.phone = 'El teléfono debe tener entre 8 y 15 dígitos'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Función para manejar cambios en los inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Función para guardar cambios
  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim() || null,
          firstName: formData.firstName.trim() || null,
          lastName: formData.lastName.trim() || null,
          phone: formData.phone.trim() || null
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.field && errorData.message) {
          setErrors({ [errorData.field]: errorData.message })
          return
        }
        throw new Error(errorData.message || 'Error al actualizar el perfil')
      }

      onProfileUpdate({
        username: formData.username.trim() || null,
        firstName: formData.firstName.trim() || null,
        lastName: formData.lastName.trim() || null,
        phone: formData.phone.trim() || null
      })

      toast.success('Perfil actualizado correctamente')
      setIsOpen(false)

    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar el perfil')
    } finally {
      setIsUpdating(false)
    }
  }

  // Resetear formulario cuando se abre el modal
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setFormData({
        username: currentUsername || '',
        firstName: currentFirstName || '',
        lastName: currentLastName || '',
        phone: currentPhone || ''
      })
      setErrors({})
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="bg-gradient-to-b from-primary/95 to-chart-5/65 text-white hover:from-primary/100 hover:to-chart-5/90">
          <Edit className="h-4 w-4" />
          Editar perfil
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">
              Nombre de usuario
              <span className="text-xs text-muted-foreground ml-2">(requerido)</span>
            </Label>
            <Input
              id="username"
              placeholder="ej: juan_perez"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Solo letras, números y . _ - permitidos
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
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName}</p>
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
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName}</p>
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
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Formato: código de país + número (8-15 dígitos)
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}