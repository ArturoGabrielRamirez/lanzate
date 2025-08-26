'use client'
import { useTranslations } from 'next-intl';
import { handleEditPassword } from "../../actions";
import { ChangePasswordButtonProps } from '../../types';
import { passwordSchema } from '../../schemas/password-schema';
import { ButtonWithPopup, InputField } from "@/features/layout/components";

export default function ChangePasswordButton({ 
  buttonText, 
  title, 
  className 
}: ChangePasswordButtonProps) {
  const t = useTranslations("auth.password-change")

  // Función simple para cambiar contraseña
  async function changePasswordAction(formData: { 
    currentPassword: string; 
    password: string; 
    confirmPassword: string; 
  }) {
    const result = await handleEditPassword(
      formData.currentPassword, 
      formData.password
    )
    return result
  }

  return (
    <div className="flex items-center gap-2">
      <ButtonWithPopup<any, { currentPassword: string; password: string; confirmPassword: string }>
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
    </div>
  )
}