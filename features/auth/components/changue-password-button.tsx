'use client'

import { ButtonWithPopup, InputField } from "@/features/layout/components";
import { handleEditPassword } from "@/features/auth/actions/handle-edit-password";
import { passwordSchema } from "../schemas/password-schema";
import { ChangePasswordButtonProps } from "../types";

export default function ChangePasswordButton({
    buttonText,
    title,
    className
}: ChangePasswordButtonProps) {

    async function changePasswordAction(formData: { 
        currentPassword: string; 
        password: string; 
        confirmPassword: string; 
    }) {
              
        const result = await handleEditPassword(formData.currentPassword, formData.password);
        
        if (result.error) {
            return { 
                error: true, 
                message: result.error,
                payload: null
            };
        }
        
        return { 
            error: false, 
            message: "Contraseña actualizada correctamente",
            payload: result.data || null
        };
    }

    return (
        <ButtonWithPopup
            text={buttonText}
            title={title}
            description="Por seguridad, confirma tu contraseña actual antes de cambiarla."
            action={changePasswordAction}
            schema={passwordSchema}
            messages={{
                success: "Contraseña actualizada correctamente",
                error: "Error al actualizar la contraseña",
                loading: "Verificando y actualizando contraseña..."
            }}
            className={className}
            variant="default"
        >
            <InputField 
                name="currentPassword" 
                label="Contraseña actual" 
                type="password" 
                placeholder="Tu contraseña actual"
            />
            <InputField 
                name="password" 
                label="Nueva contraseña" 
                type="password" 
                placeholder="Mínimo 6 caracteres"
            />
            <InputField 
                name="confirmPassword" 
                label="Confirmar nueva contraseña" 
                type="password" 
                placeholder="Confirma tu nueva contraseña"
            />
        </ButtonWithPopup>
    );
}