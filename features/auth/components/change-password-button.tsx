'use client'

import { useTranslations } from 'next-intl';
import { ButtonWithPopup, InputField } from "@/features/layout/components";
import { handleEditPassword } from "@/features/auth/actions/handle-edit-password";
import { passwordSchema } from "../schemas/password-schema";
import { ChangePasswordButtonProps } from "../types";

export default function ChangePasswordButton({
    buttonText,
    title,
    className
}: ChangePasswordButtonProps) {
    const t = useTranslations("auth.password-change");

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
            message: t("password-updated"),
            payload: result.data || null
        };
    }

    return (
        <ButtonWithPopup
            text={buttonText}
            title={title}
            description={t("security-description")}
            action={changePasswordAction}
            schema={passwordSchema}
            messages={{
                success: t("password-updated"),
                error: t("error-updating-password"),
                loading: t("verifying-updating")
            }}
            className={className}
            variant="default"
        >
            <InputField 
                name="currentPassword" 
                label={t("current-password-label")} 
                type="password" 
                placeholder={t("current-password-placeholder")}
            />
            <InputField 
                name="password" 
                label={t("new-password-label")} 
                type="password" 
                placeholder={t("new-password-placeholder")}
            />
            <InputField 
                name="confirmPassword" 
                label={t("confirm-password-label")} 
                type="password" 
                placeholder={t("confirm-password-placeholder")}
            />
        </ButtonWithPopup>
    );
}