import { Settings, Lock } from 'lucide-react'
import ButtonWithPopup from '@/features/layout/components/button-with-popup'
import { InputField, CheckboxField } from '@/features/layout/components'
import { updateProfileSettings } from '../actions/update-profile-settings'
import { profileConfigSchema } from '../schemas/profile-config-schema'
import { ProfileSettingsFormProps } from '../types'

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
    return (
        <ButtonWithPopup
            text={<><Settings className="w-4 h-4 mr-2" />Configurar Perfil</>}
            title="Configuración del Perfil"
            description="Personaliza tu información pública y configuraciones de privacidad"
            action={updateProfileSettings}
            messages={{
                success: "Perfil actualizado correctamente",
                loading: "Guardando cambios...",
                error: "Error al actualizar el perfil"
            }}
            schema={profileConfigSchema}
            variant="outline"
            className="w-full md:w-auto"
            contentButton="Guardar cambios"
            onComplete={() => window.location.reload()}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="first_name"
                    label="Nombre"
                    defaultValue={user.first_name || ''}
                    placeholder="Tu nombre"
                />
                <InputField
                    name="last_name"
                    label="Apellido"
                    defaultValue={user.last_name || ''}
                    placeholder="Tu apellido"
                />
                <div className="md:col-span-2">
                    <InputField
                        name="profile_bio"
                        label="Biografía"
                        defaultValue={user.profile_bio || ''}
                        placeholder="Cuéntanos sobre ti..."
                        isTextArea
                        maxLength={500}
                    />
                </div>
                <InputField
                    name="location"
                    label="Ubicación"
                    defaultValue={user.location || ''}
                    placeholder="Ciudad, País"
                />

                <div className="md:col-span-2 pt-4 border-t border-gray-700">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                        <Lock className="w-4 h-4" />
                        Configuraciones de Privacidad
                    </h4>

                    <div className="space-y-4">
                        <CheckboxField
                            name="profile_is_public"
                            label="Perfil público"
                            defaultValue={user.profile_is_public}
                        />
                        <CheckboxField
                            name="show_liked_products"
                            label="Mostrar productos que me gustan"
                            defaultValue={user.show_liked_products}
                        />
                        <CheckboxField
                            name="show_comments"
                            label="Mostrar comentarios"
                            defaultValue={user.show_comments}
                        />
                        <CheckboxField
                            name="show_activity"
                            label="Mostrar actividad"
                            defaultValue={user.show_activity}
                        />
                        <CheckboxField
                            name="show_location"
                            label="Mostrar ubicación"
                            defaultValue={user.show_location}
                        />
                    </div>
                </div>
            </div>
        </ButtonWithPopup>
    )
}
