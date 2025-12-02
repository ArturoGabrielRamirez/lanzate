import { Edit } from "lucide-react"

import { ProfileFormFields } from "@/features/auth/components/profile"
import { profileSchema, ProfileFormData } from "@/features/auth/schemas/profile-schema"
import { ProfileEditorProps } from '@/features/auth/types'
import { ButtonWithPopup } from "@/features/global/components/button-with-popup"

export function ProfileEditor({
  currentEmail,
  currentUsername,
  currentFirstName,
  currentLastName,
  currentPhone,
  onProfileUpdate
}: ProfileEditorProps & { currentEmail: string }) {
  const updateProfileAction = async (formData: ProfileFormData) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim() || null,
          firstName: formData.firstName?.trim() || null,
          lastName: formData.lastName?.trim() || null,
          phone: formData.phone?.trim() || null
        }),
      })

      const responseData = await response.json();

      if (!response.ok) {
        return {
          hasError: true,
          message: responseData.message || 'Error al actualizar el perfil',
          payload: undefined,
        }
      }

      onProfileUpdate({
        username: formData.username.trim() || null,
        firstName: formData.firstName?.trim() || null,
        lastName: formData.lastName?.trim() || null,
        phone: formData.phone?.trim() || null
      });

      return {
        hasError: false,
        message: 'Perfil actualizado correctamente',
        payload: undefined,
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      return {
        hasError: true,
        message: error instanceof Error ? error.message : 'Error desconocido al actualizar el perfil',
        payload: undefined,
      }
    }
  }

  const formKey = `profile-${currentUsername}-${currentFirstName}-${currentLastName}-${currentPhone}`

  const defaultValues: ProfileFormData = {
    username: currentUsername || '',
    firstName: currentFirstName || '',
    lastName: currentLastName || '',
    phone: currentPhone || ''
  }

  return (
    <ButtonWithPopup<ProfileFormData>
      key={formKey}
      text={
        <Edit className="h-4 w-4" />
      }
      title="Editar Perfil"
      onlyIcon
      variant="default"
      size="sm"
      data-action="edit-profile"
      description="Actualiza tu información personal y de contacto. Recuerda que el nombre de usuario es único."
      action={updateProfileAction}
      schema={profileSchema}
      messages={{
        success: 'Perfil actualizado correctamente',
        error: 'Error al actualizar el perfil',
        loading: 'Guardando cambios...'
      }}
      defaultValues={defaultValues}
    >
      <ProfileFormFields currentEmail={currentEmail} />
    </ButtonWithPopup>
  )
}